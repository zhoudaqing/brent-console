package cn.brent.console.webapp.priv;

import cn.brent.console.priv.MenuPriv;

public class UserPriv extends MenuPriv{

	
	public static final String MenuID = "Console.User";

	public static final String Edit = MenuID+".Edit";
	public static final String Delete = MenuID+".Delete";
	public static final String SetPriv = MenuID+".SetPriv";
	public static final String ChangePassword = MenuID+".ChangePassword";
	public static final String Disable = MenuID+".Disable";
	public static final String Enable = MenuID+".Enable";
	
	protected UserPriv() {
		super(MenuID,"用户管理");
		addItem(Edit, "新增|编辑");
		addItem(Delete, "删除");
		addItem(SetPriv, "设置权限");
		addItem(ChangePassword, "修改密码");
		addItem(Disable, "禁用");
		addItem(Enable, "启用");
	}
	
}
