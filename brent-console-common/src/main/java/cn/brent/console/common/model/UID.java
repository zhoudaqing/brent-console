package cn.brent.console.common.model;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class UID implements Serializable{
	
	public enum SYS{
		WEB("console"),//后台
		EIP("web");//网站
		
		private String code;
		
		SYS(String code){
			this.code=code;
		}
		public String getCode(){
			return this.code;
		}
	}

	private String uid;

	//该uid 对应的 各业务系统的id
	private Map<String, String> ids = new HashMap<String, String>();

	private String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
