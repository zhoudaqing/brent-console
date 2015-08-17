package cn.brent.console.common;

import org.apache.shiro.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cn.brent.console.Constants;
import cn.brent.console.common.model.BizUser;

import com.jfinal.core.Controller;

public class BaseController extends Controller {
	
	protected Logger logger=LoggerFactory.getLogger(getClass());
	
	protected BizUser getUser(){
		BizUser user=(BizUser)SecurityUtils.getSubject().getSession().getAttribute(Constants.USER_SESSION);
		return user;
	}

}
