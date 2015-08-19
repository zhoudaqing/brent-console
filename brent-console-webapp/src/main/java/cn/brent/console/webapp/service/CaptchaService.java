package cn.brent.console.webapp.service;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Random;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;

import cn.brent.toolbox.web.model.RequestContext;

/**
 * 图形验证码
 * @author liudong
 */
public class CaptchaService {

	private final static String KEY = "Captcha";
	private final static String PARAM="verifyCode";
	private static int WIDTH = 120;
	private static int HEIGHT = 40;
	private static int LENGTH = 5;
	private final static Random random = new Random();
	
	/**
	 * 生成验证码
	 * @param req
	 * @param res
	 * @throws IOException 
	 */
	public static void get(RequestContext ctx,String bizCode){
		try {
			if(ctx.isRobot()){
				ctx.forbidden();
				return;
			}
			ctx.closeCache();
			ctx.response().setContentType("image/png");
			_Render(_GenerateRegKey(ctx.request(),bizCode), ctx.response().getOutputStream(), WIDTH, HEIGHT);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
	
	private static String getKey(HttpServletRequest req,String bizCode){
		return KEY+"-"+bizCode;
	}
	
	/**
	 * 检查验证码是否正确
	 * @param req
	 * @return
	 */
	public static boolean validate(HttpServletRequest req,String bizCode) {
		boolean result = false;
		String ssnId = getKey(req, bizCode);
		String code1 = SessionService.get(ssnId);
		String code2 = req.getParameter(PARAM);
		result = code1!=null && code2!=null && StringUtils.equalsIgnoreCase(code1, code2);
		if(result){
			SessionService.remove(ssnId);
		}
		return result;		
	}
	
	/**
	 * 清除验证码信息
	 * @param req
	 */
	public static void clear(HttpServletRequest req,String bizCode) {
		SessionService.remove(getKey(req, bizCode));
	}
	
	private static String _GenerateRegKey(HttpServletRequest req,String bizCode) {
		String code = RandomStringUtils.randomAlphanumeric(LENGTH).toUpperCase();
		code.replace('0', 'W');
		code.replace('o', 'R');
		code.replace('I', 'E');
		code.replace('1', 'T');
		SessionService.set(getKey(req, bizCode), code);
		return code;
	}
	
    /**
     * 画随机码图
     * @param text
     * @param out
     * @param width
     * @param height
     * @throws IOException
     */
    private static void _Render(String text, OutputStream out, int width, int height) throws IOException {
	    BufferedImage bi = new BufferedImage(width,height,BufferedImage.TYPE_INT_RGB);        
	    Graphics2D g = (Graphics2D)bi.getGraphics();
	    
	    g.setColor(Color.WHITE);
	    g.fillRect(0,0,width,height);
    	//g.setColor(Color.RED);
	    //g.drawRect(1,1,width-2,height-2);
	    for(int i=0;i<10;i++){
	    	g.setColor(_GetRandColor(150, 250));
	    	g.drawOval(random.nextInt(110), random.nextInt(24), 5+random.nextInt(10), 5+random.nextInt(10));
	    }
	    Font mFont = new Font("Arial", Font.ITALIC, 28);
	    g.setFont(mFont);
	    g.setColor(_GetRandColor(10,240));
	    g.drawString(text, 10, 30);
	    ImageIO.write(bi, "png", out);
    }
    
    private static Color _GetRandColor(int fc,int bc){//给定范围获得随机颜色
		if (fc > 255) fc = 255;
		if (bc > 255) bc = 255;
		int r = fc + random.nextInt(bc - fc);
		int g = fc + random.nextInt(bc - fc);
		int b = fc + random.nextInt(bc - fc);
		return new Color(r, g, b);
	}

    
}
