package cn.brent.console.webapp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cn.brent.console.webapp.common.BizUser;
import cn.brent.console.webapp.service.SessionService;

import com.jfinal.core.Controller;

public class BaseController extends Controller {
	
	protected Logger logger=LoggerFactory.getLogger(getClass());
	
	protected BizUser getUser(){
		BizUser user=(BizUser)getSessionAttr(Constants.USER_SESSION);
		if(user!=null){
			return user;
		}
		user=SessionService.get(Constants.USER_SESSION);
		setSessionAttr(Constants.USER_SESSION, user);
		return user;
	}
}
