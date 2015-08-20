package cn.brent.console.serivce;

import cn.brent.bus.rpc.Remote;
import cn.brent.console.UserService;

public class UserServiceImpl implements UserService {

	@Remote
	@Override
	public void login(String userName, String pwd) {
		System.out.println("login");
	}

	@Remote
	@Override
	public void logout() {
		System.out.println("logout");
	}

}
