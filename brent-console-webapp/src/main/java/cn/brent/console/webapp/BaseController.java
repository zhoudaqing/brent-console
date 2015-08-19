package cn.brent.console.webapp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cn.brent.console.webapp.common.BizUser;
import cn.brent.console.webapp.service.SessionService;

import com.jfinal.core.Controller;
import com.jfinal.ext.route.ControllerBind;

public class BaseController extends Controller {
	
	protected Logger logger=LoggerFactory.getLogger(getClass());
	
	protected BizUser getUser(){
		BizUser user=SessionService.get(Constants.USER_SESSION);
		return user;
	}
}
