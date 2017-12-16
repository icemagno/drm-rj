package br.mil.mar.casnav.mclm.interceptor;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.Interceptor;

public class ClientAccessInterceptor implements Interceptor {
	private static final long serialVersionUID = -2344136157076941239L;

	
	public String intercept(ActionInvocation invocation) {
		//HttpServletRequest request = ServletActionContext.getRequest();
		//HttpSession session = request.getSession();
		try {
			return invocation.invoke();
		} catch ( Exception ignored ) {
			return "notLogged";
		}
	}
 
	@Override
	public void destroy() {
		//logger.info("system stop"); 
	}

	
	@Override
	public void init() {
		//logger.info("system init");
	}	
	
}
