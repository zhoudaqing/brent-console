package cn.brent.console.webapp.action;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authz.annotation.RequiresUser;

import cn.brent.console.webapp.BaseController;
import cn.brent.console.webapp.service.SessionService;
import cn.brent.toolbox.BizException;
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
			SessionService.login(userName, pwd);
			renderJson(JsonReturn.ok());
		} catch (Exception e) {
			logger.error("",e);
			renderJson(JsonReturn.fail(e.getMessage()));
			return;
		}
	}
	
	public void logout() {
		try {
			SessionService.logout();
			renderJson(JsonReturn.ok());
		} catch (Exception e) {
			logger.error("",e);
			renderJson(JsonReturn.fail(e.getMessage()));
			return;
		}
	}
	
	@RequiresUser
	public void getUserMenu(){
		
	}

}
