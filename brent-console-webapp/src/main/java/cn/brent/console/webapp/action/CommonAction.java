package cn.brent.console.webapp.action;

import cn.brent.console.webapp.BaseController;
import cn.brent.console.webapp.service.CaptchaService;
import cn.brent.toolbox.web.model.RequestContext;

public class CommonAction extends BaseController {

	public void captcha() {
		CaptchaService.get(RequestContext.get(), "Common");
		renderNull();
	}
	
}
