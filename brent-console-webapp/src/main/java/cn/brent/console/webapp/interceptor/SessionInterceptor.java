package cn.brent.console.webapp.interceptor;

import java.util.Date;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;

import cn.brent.console.common.model.UID;
import cn.brent.console.webapp.Constants;

import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;

public class SessionInterceptor implements Interceptor {

	@Override
	public void intercept(Invocation inv) {
		String user_cookie = inv.getController().getCookie(Constants.USER_COOKIE);
		UID user_session = (UID)inv.getController().getSession().getAttribute(Constants.USER_COOKIE);
        if(StringUtils.isBlank(user_cookie) && user_session != null) {
        	inv.getController().setCookie(Constants.USER_COOKIE, user_session.getName(), 30*24 * 60 * 60);
        } else if (!StringUtils.isBlank(user_cookie) && user_session == null) {
            UID user = new UID();
            inv.getController().setSessionAttr(Constants.USER_SESSION, user);
        }
        // 获取今天时间，放到session里
        inv.getController().setSessionAttr(Constants.TODAY, DateFormatUtils.ISO_DATE_FORMAT.format(new Date()));
        inv.invoke();
	}
}
