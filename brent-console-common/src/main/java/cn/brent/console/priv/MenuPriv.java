package cn.brent.console.priv;

import java.util.HashMap;
import java.util.Map;

public abstract class MenuPriv {

	private Map<String, String> privs = new HashMap<String, String>();

	private String menuId;
	private String name;

	protected void addItem(String priv, String name) {
		privs.put(priv, name);
	}

	protected MenuPriv(String menuId,String name) {
		this.menuId = menuId;
		this.name = name;
	}

	public String getMenuId() {
		return menuId;
	}

	public Map<String, String> getPrivs() {
		return privs;
	}

}
