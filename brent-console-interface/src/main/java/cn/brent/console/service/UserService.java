package cn.brent.console.service;

import cn.brent.console.Data;

public interface UserService {
	
	public static final String NAME="console/user";
	
	public static final String SUB_NAME="console/sub/user";
	
	public static final String TOPIC_DEL="del";
	
	public Data login(String userName, String pwd);

	public void logout();

}
