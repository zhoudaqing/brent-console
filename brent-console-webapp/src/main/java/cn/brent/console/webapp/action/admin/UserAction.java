package cn.brent.console.webapp.action.admin;

import org.apache.shiro.authz.annotation.RequiresPermissions;

import cn.brent.console.webapp.BaseController;
import cn.brent.console.webapp.priv.UserPriv;
import cn.brent.toolbox.web.model.JsonReturn;

public class UserAction extends BaseController {

	@RequiresPermissions({ UserPriv.Delete })
	public void delUser() {
		try {
			
			renderJson(JsonReturn.ok());
		} catch (Exception e) {
			logger.error("", e);
			renderJson(JsonReturn.fail(e.getMessage()));
			return;
		}
	}

	@RequiresPermissions({ UserPriv.Edit })
	public void addModUser() {
		try {

			renderJson(JsonReturn.ok());
		} catch (Exception e) {
			logger.error("", e);
			renderJson(JsonReturn.fail(e.getMessage()));
			return;
		}
	}

}
