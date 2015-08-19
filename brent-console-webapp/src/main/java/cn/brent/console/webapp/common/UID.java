package cn.brent.console.webapp.common;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class UID implements Serializable{
	
	public UID(String uid) {
		super();
		this.uid = uid;
	}

	private String uid;

	private Map<SYS, String> ids = new HashMap<SYS, String>();
	
	public String getUid() {
		return uid;
	}

	public void addSYS(SYS sys,String id){
		ids.put(sys, id);
	}

	public enum SYS{
		
		/**后台*/
		CONSOLE("CONSOLE"),
		/**网站*/
		WEB("WEB");
		
		private String code;
		
		SYS(String code){
			this.code=code;
		}
		public String getCode(){
			return this.code;
		}
	}
}
