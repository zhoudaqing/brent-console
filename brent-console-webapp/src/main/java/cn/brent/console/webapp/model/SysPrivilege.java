package cn.brent.console.webapp.model;

import cn.brent.console.model.SysUserRole;

import com.jfinal.plugin.activerecord.Model;

public class SysPrivilege extends Model<SysUserRole> {

	public static final SysUserRole me = new SysUserRole();
}
