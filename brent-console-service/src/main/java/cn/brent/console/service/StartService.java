package cn.brent.console.service;

import org.zeromq.ZMQ;

import cn.brent.bus.BusStarter;
import cn.brent.bus.rpc.RpcWorkHandler;
import cn.brent.bus.util.Prop;
import cn.brent.bus.worker.WorkerContext;
import cn.brent.console.service.imp.UserServiceImpl;

import com.jfinal.ext.plugin.tablebind.AutoTableBindPlugin;
import com.jfinal.ext.plugin.tablebind.SimpleNameStyles;
import com.jfinal.plugin.druid.DruidPlugin;

public class StartService {

	public static final String CONFIG = "bus-service.properties";

	public static void main(String[] args) {
		String config = null;
		if (args.length > 0) {
			config = args[0];
		}
		BusStarter.start(null);
		start(config);
	}

	public static void start(String config) {
		
		if(config==null){
			config=CONFIG;
		}
		Prop pro = new Prop(config);

		String broker = pro.get("brokers", "127.0.0.1:15555");
		int ioThreads = pro.getInt("ioThreads", 1);
		String registerToken = pro.get("registerToken");

		String[] brokers = broker.split(",");
		
		init();

		WorkerContext wc = new WorkerContext(ZMQ.context(ioThreads), brokers, registerToken);

		register(wc);
	}
	
	public static void init(){
		Prop pro = new Prop("config.properties");
		
		DruidPlugin druid = new DruidPlugin(pro.get("jdbcUrl"),pro.get("user"), pro.get("password").trim());
		
		druid.start();

		AutoTableBindPlugin atb=new AutoTableBindPlugin(druid,SimpleNameStyles.UP_UNDERLINE);
		atb.addScanPackages("cn.brent.console.service.model");
		
		atb.start();
	}

	protected static void register(WorkerContext wc) {
		RpcWorkHandler rpc = new RpcWorkHandler(UserService.NAME);
		rpc.addVersion(new UserServiceImpl());
		wc.registerWorker(rpc, 1);
	}

}
