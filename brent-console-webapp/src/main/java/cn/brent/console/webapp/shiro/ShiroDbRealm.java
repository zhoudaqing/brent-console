package cn.brent.console.webapp.shiro;

import java.util.ArrayList;
import java.util.List;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.SimplePrincipalCollection;

import cn.brent.console.Constants;
import cn.brent.console.common.model.BizUser;
import cn.brent.console.webapp.model.SysUser;

public class ShiroDbRealm extends AuthorizingRealm {

	 /**
     * 认证回调函数,登录时调用.
     */
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authcToken) throws AuthenticationException {
        UsernamePasswordToken token = (UsernamePasswordToken) authcToken;
        SysUser user=null;
		try {
			user = SysUser.me.findFirst("select * from sys_user where UserName=? and Password=?", token.getUsername(),new String(token.getPassword()));
		} catch (Exception e) {
			throw new AuthenticationException(e.getMessage());
		}
        if (user != null) {
        	reflashBizUser(user);
        	
            return new SimpleAuthenticationInfo(user.get(SysUser.UserName), user.get(SysUser.Password), getName());
        } else {
            throw new AuthenticationException("用户名或密码错误");
        }
    }
 
    /**
     * 授权查询回调函数, 进行鉴权但缓存中无用户的授权信息时调用.
     */
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        String loginName = (String) principals.fromRealm(getName()).iterator().next();
        SysUser user = SysUser.me.findFirst("select * from sys_user where UserName=?", loginName);
        if (user != null) {
        	reflashBizUser(user);
        	
            SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
            List<String> roles=new ArrayList<String>();
            roles.add("admin");
            info.addRoles(roles);
            
            List<String> pri=new ArrayList<String>();
            pri.add("testPem");
            info.addStringPermissions(pri);
            return info;
        } else {
            return null;
        }
    }
    
 
    /**
     * 更新用户授权信息缓存.
     */
    public void clearCachedAuthorizationInfo(String principal) {
        SimplePrincipalCollection principals = new SimplePrincipalCollection(principal, getName());
        clearCachedAuthorizationInfo(principals);
    }
    
    /**
     * 刷新session中的用户信息
     * @param user
     */
    protected void reflashBizUser(SysUser user){
    	Session session = SecurityUtils.getSubject().getSession();
    	BizUser un=new BizUser();
    	un.setUser_name(user.getStr(SysUser.UserName));
    	session.setAttribute(Constants.USER_SESSION, un);
    }
 
    /**
     * 清除所有用户授权信息缓存.
     */
    public void clearAllCachedAuthorizationInfo() {
        Cache<Object, AuthorizationInfo> cache = getAuthorizationCache();
        if (cache != null) {
            for (Object key : cache.keys()) {
                cache.remove(key);
            }
        }
    }

}
