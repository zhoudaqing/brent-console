package cn.brent.console;

import org.zeromq.ZMQ;

import cn.brent.bus.BusStarter;
import cn.brent.bus.rpc.RpcWorkHandler;
import cn.brent.bus.util.Prop;
import cn.brent.bus.worker.WorkerContext;
import cn.brent.console.serivce.UserServiceImpl;

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

		WorkerContext wc = new WorkerContext(ZMQ.context(ioThreads), brokers, registerToken);

		register(wc);
	}

	protected static void register(WorkerContext wc) {
		RpcWorkHandler rpc = new RpcWorkHandler(UserService.NAME);
		rpc.addVersion(new UserServiceImpl());
		wc.registerWorker(rpc, 1);
	}

}
