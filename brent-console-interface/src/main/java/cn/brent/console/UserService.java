package cn.brent.console;

public interface UserService {
	
	public static final String NAME="console/user";
	
	public static final String SUB_NAME="console/sub/user";
	
	public static final String TOPIC_DEL="del";
	
	public void login(String userName, String pwd);

	public void logout();

}
