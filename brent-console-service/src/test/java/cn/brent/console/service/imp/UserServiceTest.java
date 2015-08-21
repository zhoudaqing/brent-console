package cn.brent.console.service.imp;

import org.junit.Test;

import cn.brent.console.service.UserService;

public class UserServiceTest extends BaseTest{
	
	protected UserService us=new UserServiceImpl();
	
	@Test
	public void testLogin(){
		System.out.println(us.login("admin", "000000"));
	}

}
