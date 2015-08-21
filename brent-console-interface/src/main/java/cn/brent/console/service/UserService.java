package cn.brent.console.service;

public interface UserService {
	
	public static final String NAME="console/user";
	
	public static final String SUB_NAME="console/sub/user";
	
	public static final String TOPIC_DEL="del";
	
	public boolean login(String userName, String pwd);

	public void logout();

}
