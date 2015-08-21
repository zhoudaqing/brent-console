package cn.brent.console.service.imp;

import cn.brent.bus.rpc.Remote;
import cn.brent.console.service.UserService;
import cn.brent.console.service.model.SysUser;
import cn.brent.toolbox.BizException;

public class UserServiceImpl implements UserService {

	@Remote
	@Override
	public boolean login(String userName, String pwd) {
		SysUser user = SysUser.dao.findFirst("select * from sys_user where UserName=? and Password=?", userName,pwd);
		if(user==null){
			throw new BizException("用户名或密码错误");
		}
		return true;
	}

	@Remote
	@Override
	public void logout() {
		
	}
	
	

}
