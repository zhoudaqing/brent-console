package cn.brent.console.webapp.common;

import java.io.Serializable;

public class BizUser implements Serializable{

	/** */
	private static final long serialVersionUID = 1L;

	private String user_name;
	
	private String mobile;
	
	private String email;

	private UID uid;

	public UID getUid() {
		return uid;
	}

	public void setUid(UID uid) {
		this.uid = uid;
	}

	public String getUser_name() {
		return user_name;
	}

	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
}
