package cn.brent.console.webapp;

import cn.brent.console.model.SysMessage;
import cn.brent.console.model.SysPrivilege;
import cn.brent.console.model.SysRole;
import cn.brent.console.model.SysSite;
import cn.brent.console.model.SysUser;
import cn.brent.console.model.SysUserLog;
import cn.brent.console.model.SysUserRole;
import cn.brent.toolbox.web.model.JsonReturn;

import com.jfinal.config.Constants;
import com.jfinal.config.Handlers;
import com.jfinal.config.Interceptors;
import com.jfinal.config.JFinalConfig;
import com.jfinal.config.Plugins;
import com.jfinal.config.Routes;
import com.jfinal.ext.handler.ContextPathHandler;
import com.jfinal.ext.plugin.shiro.ShiroInterceptor;
import com.jfinal.ext.plugin.shiro.ShiroPlugin;
import com.jfinal.ext.plugin.sqlinxml.SqlInXmlPlugin;
import com.jfinal.ext.route.AutoBindRoutes;
import com.jfinal.plugin.activerecord.ActiveRecordPlugin;
import com.jfinal.plugin.druid.DruidPlugin;
import com.jfinal.plugin.ehcache.EhCachePlugin;
import com.jfinal.render.IErrorRenderFactory;
import com.jfinal.render.JsonRender;
import com.jfinal.render.Render;
import com.jfinal.render.ViewType;

/**
 * API引导式配置
 */
public class Config extends JFinalConfig {

	private Routes routes;

	/**
	 * 配置常量
	 */
	public void configConstant(Constants me) {
		// 加载少量必要配置，随后可用getProperty(...)获取值
		loadPropertyFile("config.properties");
		me.setDevMode(getPropertyToBoolean("devMode", false));

		me.setErrorRenderFactory(new IErrorRenderFactory() {
			@Override
			public Render getRender(int errorCode, String view) {
				if (errorCode == 401 ) {
					return new JsonRender(JsonReturn.fail(errorCode,"没有登录"));
				} else if (errorCode == 403) {
					return new JsonRender(JsonReturn.fail(errorCode,"没有权限。"));
				} else if (errorCode == 404) {
					return new JsonRender(JsonReturn.fail(errorCode,"URL不存在。"));
				} else if (errorCode == 500) {
					return new JsonRender(JsonReturn.fail(errorCode,"系统异常，请联系管理员。"));
				} else {
					return new JsonRender(JsonReturn.fail(errorCode,"未知异常"));
				}
			}
		});
		me.setViewType(ViewType.OTHER);
	}

	/**
	 * 配置路由
	 */
	public void configRoute(Routes me) {
		routes = me;
		Routes r=new AutoBindRoutes().suffix("Action");
		routes.add(r);
	}

	/**
	 * 配置插件
	 */
	public void configPlugin(Plugins me) {
		// 配置数据库连接池插件
		DruidPlugin druid = new DruidPlugin(getProperty("jdbcUrl"),
				getProperty("user"), getProperty("password").trim());
		me.add(druid);

		// 配置ActiveRecord插件
		ActiveRecordPlugin arp = new ActiveRecordPlugin(druid);
		initTable(arp);
		me.add(arp);

		// shiro权限管理
		ShiroPlugin shiro = new ShiroPlugin(routes);
		me.add(shiro);

		// 复杂SQL用xml管理 获取：SqlKit.sql("xx.xx")
		SqlInXmlPlugin sqlInXml = new SqlInXmlPlugin();
		me.add(sqlInXml);

		// 缓存插件
		EhCachePlugin ehcahe = new EhCachePlugin();
		me.add(ehcahe);
	}

	private void initTable(ActiveRecordPlugin arp) {
		arp.addMapping("sys_user", SysUser.class); 
		arp.addMapping("sys_user_role", SysUserRole.class);
		arp.addMapping("sys_user_log", SysUserLog.class);
		arp.addMapping("sys_site", SysSite.class);
		arp.addMapping("sys_role", SysRole.class);
		arp.addMapping("sys_privilege", SysPrivilege.class);
		arp.addMapping("sys_message", SysMessage.class);
	}

	/**
	 * 配置全局拦截器
	 */
	public void configInterceptor(Interceptors me) {
		me.add(new ShiroInterceptor());
	}

	/**
	 * 配置处理器
	 */
	public void configHandler(Handlers me) {
		me.add(new ContextPathHandler("ctx_path"));
	}

}
