package cn.brent.console;

import java.util.HashMap;
import java.util.Map;

public class Data extends HashMap<String, Object>{

	/** */
	private static final long serialVersionUID = 1L;

	public Data(Map<String, Object> attrs) {
		super(attrs);
	}
	
	public static Data to(Map<String, Object> attrs){
		return new Data(attrs);
	}
}
