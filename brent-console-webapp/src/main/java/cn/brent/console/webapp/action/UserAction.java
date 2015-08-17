package cn.brent.console.webapp.action;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;

import cn.brent.console.common.BaseController;
import cn.brent.console.common.BizException;
import cn.brent.toolbox.web.model.JsonReturn;

public class UserAction extends BaseController {

	public void login() {
		try {
			String userName = getPara("userName");
			String pwd = getPara("pwd");
			if (StringUtils.isEmpty(userName)) {
				throw new BizException("userName is null.");
			}
			if (StringUtils.isEmpty(pwd)) {
				throw new BizException("pwd is null.");
			}
			SecurityUtils.getSubject().login(new UsernamePasswordToken(userName, pwd, true));
			renderJson(JsonReturn.ok());
		} catch (Exception e) {
			logger.error("",e);
			renderJson(JsonReturn.fail(e.getMessage()));
			return;
		}
	}
	
	public void logout() {
		try {
			SecurityUtils.getSubject().logout();
			renderJson(JsonReturn.ok());
		} catch (Exception e) {
			logger.error("",e);
			renderJson(JsonReturn.fail(e.getMessage()));
			return;
		}
	}
	
	

}
