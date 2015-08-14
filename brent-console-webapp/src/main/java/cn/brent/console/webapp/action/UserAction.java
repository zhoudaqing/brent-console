package cn.brent.console.webapp.action;

import org.apache.commons.lang3.StringUtils;

import cn.brent.console.model.SysUser;
import cn.brent.toolbox.web.model.JsonReturn;

import com.jfinal.core.Controller;

public class UserAction extends Controller {

	public void getUserByNamePwd(){
		String userName=getPara("userName");
		String pwd=getPara("pwd");
		if(StringUtils.isEmpty(userName)){
			renderJson(JsonReturn.fail("userName is null."));
			return;
		}
		if(StringUtils.isEmpty(pwd)){
			renderJson(JsonReturn.fail("pwd is null."));
			return;
		}
		try {
			SysUser user = SysUser.me.findFirst("select * from sys_user where UserName=? and Password=?", userName,pwd);
			user.set("Password", "*******");
			renderJson(JsonReturn.ok(user));
		} catch (Exception e) {
			e.printStackTrace();
			renderJson(JsonReturn.fail(e.getMessage()));
			return;
		}
	}

}
