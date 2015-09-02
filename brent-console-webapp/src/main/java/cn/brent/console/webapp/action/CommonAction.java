package cn.brent.console.webapp.action;

import cn.brent.console.webapp.BaseController;
import cn.brent.console.webapp.service.CaptchaService;
import cn.brent.toolbox.web.model.JsonReturn;
import cn.brent.toolbox.web.model.RequestContext;

import com.alibaba.fastjson.JSONObject;

public class CommonAction extends BaseController {

	public void captcha() {
		CaptchaService.get(RequestContext.get(), "Common");
		renderNull();
	}
	
	public void getWebContent(){
		JSONObject obj=new JSONObject();
		obj.put("user", getUser());
		obj.put("login", getUser()!=null?true:false);
		obj.put("contextPath", getRequest().getContextPath());
		renderJson(JsonReturn.ok(obj));
	}
	
}
