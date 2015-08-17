package cn.brent.console.webapp.action;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.apache.shiro.authz.annotation.RequiresUser;

import cn.brent.console.common.BaseController;
import cn.brent.toolbox.web.model.JsonReturn;

public class TestAction extends BaseController{

	public void test(){
		System.out.println(getUser());
		renderJson(JsonReturn.ok(getUser()));
	}
	
	@RequiresUser
	public void testUser(){
		renderJson(JsonReturn.ok("aa"));
	}
	
	@RequiresRoles(value = { "admin" })
	public void testRole(){
		renderJson(JsonReturn.ok("aa"));
	}
	
	@RequiresPermissions(value = { "testPem" })
	public void testPem(){
		renderJson(JsonReturn.ok("aa"));
	}
	
	public void testError(){
		throw new RuntimeException("test error");
	}
}
