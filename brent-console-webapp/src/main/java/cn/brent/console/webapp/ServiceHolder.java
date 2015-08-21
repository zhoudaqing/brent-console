package cn.brent.console.webapp;

import cn.brent.bus.rpc.RpcFactory;
import cn.brent.bus.rpc.SubsService;
import cn.brent.console.UserService;

import com.jfinal.kit.Prop;

public class ServiceHolder {
	
	private static Prop pro=new Prop("config.properties");
	
	public static RpcFactory rpcFactory=new RpcFactory(pro.get("busBrokers","").split(","));

	public static UserService userService=rpcFactory.getService(UserService.class, UserService.NAME);
	
	public static SubsService userSub=rpcFactory.getPubService(UserService.SUB_NAME);
	
}
