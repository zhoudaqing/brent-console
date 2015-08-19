package cn.brent.console.webapp.service;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;

public class SessionService {

	@SuppressWarnings("unchecked")
	public static <T> T get(String key){
		return (T)SecurityUtils.getSubject().getSession().getAttribute(key);
	}
	
	public static void set(String key,Object obj){
		SecurityUtils.getSubject().getSession().setAttribute(key, obj);
	}
	
	public static void remove(String key){
		SecurityUtils.getSubject().getSession().removeAttribute(key);
	}
	
	public static void login(String userName,String pwd){
		SecurityUtils.getSubject().login(new UsernamePasswordToken(userName, pwd, true));
	}
	
	public static void logout(){
		SecurityUtils.getSubject().logout();
	}
	
	
}
