'use strict';

/* Services */

var ppjrServices = angular.module('springbootServices', [ 'ngResource' ]);

ppjrServices.factory('ppJSON', [ '$resource', function($resource) {
	return $resource('/jsonFile/:dir/:fileName.json', {
		dir : '@dir',
		fileName : '@fileName'
	}, {
		query : {
			method : 'GET',
			params : {}
		}
	});
} ]);

ppjrServices.factory('ppJSONDefer', [ '$resource', function($resource) {
	return $resource('/jsonFile/:dir/:fileName.json', {
		dir : '@dir',
		fileName : '@fileName'
	},{  
	    query : function() {  
	      // 声明延后执行，表示要去监控后面的执行
	      var deferred = $q.defer();  
	      success(function(data, status, headers, config) {  
	    	//声明执行成功，即http请求数据成功，可以返回数据了
	        deferred.resolve(data);  
	      }).  
	      error(function(data, status, headers, config) {  
	    	// 声明执行失败，即服务器返回错误  
	        deferred.reject(data);
	      });  
	      // 返回承诺，这里并不是最终数据，而是访问最终数据的API
	      return deferred.promise;  
	    } // end query  
	  });  
} ]);

ppjrServices.factory('ppObj', [ '$resource', function($resource) {
	return $resource('/:use/:opt.json', {
		use : '@use',
		opt : '@opt'
	}, {
		query : {
			method : 'GET',
			params : {},
			isArray : true
		},
		post : {
			method : 'POST',
			params : {}
		},
		update : {
			method : 'PUT',
			params : {}
		},
		delete : {
			method : 'DELETE',
			params : {}
		}
	});
} ]);

ppjrServices.factory('ppTools', function(ppObj , ppJSON , ppJSONDefer) {
	
	function queryPaging(path, netpos, idString, num, call_back) {
		if (num === undefined)
			num = 1;

		path.pageNum = num;
		path.rows = netpos.rows;

		var date = netpos.date;
		if (date !== undefined && date.bdate !== undefined) {
			netpos.args.bdate = formatDate(date.bdate);
		}
		if (date !== undefined && date.edate !== undefined) {
			netpos.args.edate = formatDate(date.edate);
		}
		ppObj.post(path, netpos.args, function(obj) {
			netpstPaging(path, obj, idString, false, call_back);
			angular.copy(obj, netpos);
			if (date !== undefined) {
				netpos.date = date;
			}
		});
	};
	
	function getCitys(pid) {
		//查询城市信息
		var _returnArr = [];
		ppJSON.query({"fileName":"citys_data"} , function(obj){
			angular.forEach(obj.data , function(value) {
	             if (value.pid == pid) {
	            	 _returnArr.push(value);
	             }
	        });
		});
		return _returnArr;
	}
	
	function getCityName(id) {
		//查询城市信息
		var _returnObj = {};
		var promise = ppJSONDefer.query({"fileName":"citys_data"});
		// 调用承诺API获取数据 .resolve
		promise.then(function(data) {
			angular.forEach(data.data , function(value) {
	        	if (value.id == id) {
	        		_returnObj = value;
	        	}
			});
	    }, function(data) {
	    	//..reject
	        throw new Error("parse error.");
	    });
		return _returnObj;
	}

	function netpstPaging(path, netpos, idString, isBind, call_back) {
		if (isBind === undefined)
			isBind = true;

		if (netpos.pageCount === 0) {
			$("#" + idString).html("");
		}
		$("#" + idString).bootpag({
			paginationClass : 'pagination pagination-sm',
			next : '<i class="fa fa-angle-right"></i>',
			prev : '<i class="fa fa-angle-left"></i>',
			total : netpos.pageCount,
			page : netpos.pageNum,
			maxVisible : 6
		});
		if (isBind) {
			$("#" + idString).on('page', function(event, num) {
				queryPaging(path, netpos, idString, num, call_back);
			});
		}
		if (call_back !== undefined) {
			setTimeout(function() {
				call_back();
			}, 100);
		}

	};

	function formatDate(dateString) {
		if (angular.isNumber(dateString)) {
			return dateString;
		} else if (angular.isString(dateString)) {
			var regx = /^\d{4}-\d{2}-\d{2}$/g;
			if (dateString.length < 11 && regx.test(dateString)) {
				try {
					var timestamp = new angular.mock.TzDate(0, dateString
							+ 'T00:00:00Z');
					return timestamp.getTime() - 28800000;
				} catch (e) {
					console.info(e);
				}
			}
			return dateString;
		}
	};

	function utf16to8(str) {
		var out, i, len, c;
		out = "";
		len = str.length;
		for (i = 0; i < len; i++) {
			c = str.charCodeAt(i);
			if ((c >= 0x0001) && (c <= 0x007F)) {
				out += str.charAt(i);
			} else if (c > 0x07FF) {
				out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
				out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
			} else {
				out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
			}
		}
		return out;
	};
	
	function formatStr(str) {
		var args = Array.prototype.slice.call(arguments),sourceStr = args.shift();
  		//console.log(args);
  		function execReplace(text,replacement,index){
  			return text.replace(new RegExp("\\{"+index+"\\}",'g'),replacement);
  		}
  		var _r = args.reduce(execReplace,sourceStr);
  		//console.log(_r);
  		return _r;
	}
	
	function md5(str){
		 /*
		    * Add integers, wrapping at 2^32. This uses 16-bit operations internally
		    * to work around bugs in some JS interpreters.
		    */
		    function safe_add(x, y) {
		        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
		            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		        return (msw << 16) | (lsw & 0xFFFF);
		    }

		    /*
		    * Bitwise rotate a 32-bit number to the left.
		    */
		    function bit_rol(num, cnt) {
		        return (num << cnt) | (num >>> (32 - cnt));
		    }

		    /*
		    * These functions implement the four basic operations the algorithm uses.
		    */
		    function md5_cmn(q, a, b, x, s, t) {
		        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
		    }
		    function md5_ff(a, b, c, d, x, s, t) {
		        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
		    }
		    function md5_gg(a, b, c, d, x, s, t) {
		        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
		    }
		    function md5_hh(a, b, c, d, x, s, t) {
		        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
		    }
		    function md5_ii(a, b, c, d, x, s, t) {
		        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
		    }

		    /*
		    * Calculate the MD5 of an array of little-endian words, and a bit length.
		    */
		    function binl_md5(x, len) {
		        /* append padding */
		        x[len >> 5] |= 0x80 << ((len) % 32);
		        x[(((len + 64) >>> 9) << 4) + 14] = len;

		        var i, olda, oldb, oldc, oldd,
		            a =  1732584193,
		            b = -271733879,
		            c = -1732584194,
		            d =  271733878;

		        for (i = 0; i < x.length; i += 16) {
		            olda = a;
		            oldb = b;
		            oldc = c;
		            oldd = d;

		            a = md5_ff(a, b, c, d, x[i],       7, -680876936);
		            d = md5_ff(d, a, b, c, x[i +  1], 12, -389564586);
		            c = md5_ff(c, d, a, b, x[i +  2], 17,  606105819);
		            b = md5_ff(b, c, d, a, x[i +  3], 22, -1044525330);
		            a = md5_ff(a, b, c, d, x[i +  4],  7, -176418897);
		            d = md5_ff(d, a, b, c, x[i +  5], 12,  1200080426);
		            c = md5_ff(c, d, a, b, x[i +  6], 17, -1473231341);
		            b = md5_ff(b, c, d, a, x[i +  7], 22, -45705983);
		            a = md5_ff(a, b, c, d, x[i +  8],  7,  1770035416);
		            d = md5_ff(d, a, b, c, x[i +  9], 12, -1958414417);
		            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
		            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
		            a = md5_ff(a, b, c, d, x[i + 12],  7,  1804603682);
		            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
		            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
		            b = md5_ff(b, c, d, a, x[i + 15], 22,  1236535329);

		            a = md5_gg(a, b, c, d, x[i +  1],  5, -165796510);
		            d = md5_gg(d, a, b, c, x[i +  6],  9, -1069501632);
		            c = md5_gg(c, d, a, b, x[i + 11], 14,  643717713);
		            b = md5_gg(b, c, d, a, x[i],      20, -373897302);
		            a = md5_gg(a, b, c, d, x[i +  5],  5, -701558691);
		            d = md5_gg(d, a, b, c, x[i + 10],  9,  38016083);
		            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
		            b = md5_gg(b, c, d, a, x[i +  4], 20, -405537848);
		            a = md5_gg(a, b, c, d, x[i +  9],  5,  568446438);
		            d = md5_gg(d, a, b, c, x[i + 14],  9, -1019803690);
		            c = md5_gg(c, d, a, b, x[i +  3], 14, -187363961);
		            b = md5_gg(b, c, d, a, x[i +  8], 20,  1163531501);
		            a = md5_gg(a, b, c, d, x[i + 13],  5, -1444681467);
		            d = md5_gg(d, a, b, c, x[i +  2],  9, -51403784);
		            c = md5_gg(c, d, a, b, x[i +  7], 14,  1735328473);
		            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

		            a = md5_hh(a, b, c, d, x[i +  5],  4, -378558);
		            d = md5_hh(d, a, b, c, x[i +  8], 11, -2022574463);
		            c = md5_hh(c, d, a, b, x[i + 11], 16,  1839030562);
		            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
		            a = md5_hh(a, b, c, d, x[i +  1],  4, -1530992060);
		            d = md5_hh(d, a, b, c, x[i +  4], 11,  1272893353);
		            c = md5_hh(c, d, a, b, x[i +  7], 16, -155497632);
		            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
		            a = md5_hh(a, b, c, d, x[i + 13],  4,  681279174);
		            d = md5_hh(d, a, b, c, x[i],      11, -358537222);
		            c = md5_hh(c, d, a, b, x[i +  3], 16, -722521979);
		            b = md5_hh(b, c, d, a, x[i +  6], 23,  76029189);
		            a = md5_hh(a, b, c, d, x[i +  9],  4, -640364487);
		            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
		            c = md5_hh(c, d, a, b, x[i + 15], 16,  530742520);
		            b = md5_hh(b, c, d, a, x[i +  2], 23, -995338651);

		            a = md5_ii(a, b, c, d, x[i],       6, -198630844);
		            d = md5_ii(d, a, b, c, x[i +  7], 10,  1126891415);
		            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
		            b = md5_ii(b, c, d, a, x[i +  5], 21, -57434055);
		            a = md5_ii(a, b, c, d, x[i + 12],  6,  1700485571);
		            d = md5_ii(d, a, b, c, x[i +  3], 10, -1894986606);
		            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
		            b = md5_ii(b, c, d, a, x[i +  1], 21, -2054922799);
		            a = md5_ii(a, b, c, d, x[i +  8],  6,  1873313359);
		            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
		            c = md5_ii(c, d, a, b, x[i +  6], 15, -1560198380);
		            b = md5_ii(b, c, d, a, x[i + 13], 21,  1309151649);
		            a = md5_ii(a, b, c, d, x[i +  4],  6, -145523070);
		            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
		            c = md5_ii(c, d, a, b, x[i +  2], 15,  718787259);
		            b = md5_ii(b, c, d, a, x[i +  9], 21, -343485551);

		            a = safe_add(a, olda);
		            b = safe_add(b, oldb);
		            c = safe_add(c, oldc);
		            d = safe_add(d, oldd);
		        }
		        return [a, b, c, d];
		    }

		    /*
		    * Convert an array of little-endian words to a string
		    */
		    function binl2rstr(input) {
		        var i,
		            output = '';
		        for (i = 0; i < input.length * 32; i += 8) {
		            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
		        }
		        return output;
		    }

		    /*
		    * Convert a raw string to an array of little-endian words
		    * Characters >255 have their high-byte silently ignored.
		    */
		    function rstr2binl(input) {
		        var i,
		            output = [];
		        output[(input.length >> 2) - 1] = undefined;
		        for (i = 0; i < output.length; i += 1) {
		            output[i] = 0;
		        }
		        for (i = 0; i < input.length * 8; i += 8) {
		            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
		        }
		        return output;
		    }

		    /*
		    * Calculate the MD5 of a raw string
		    */
		    function rstr_md5(s) {
		        return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
		    }

		    /*
		    * Calculate the HMAC-MD5, of a key and some data (raw strings)
		    */
		    function rstr_hmac_md5(key, data) {
		        var i,
		            bkey = rstr2binl(key),
		            ipad = [],
		            opad = [],
		            hash;
		        ipad[15] = opad[15] = undefined;                        
		        if (bkey.length > 16) {
		            bkey = binl_md5(bkey, key.length * 8);
		        }
		        for (i = 0; i < 16; i += 1) {
		            ipad[i] = bkey[i] ^ 0x36363636;
		            opad[i] = bkey[i] ^ 0x5C5C5C5C;
		        }
		        hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
		        return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
		    }

		    /*
		    * Convert a raw string to a hex string
		    */
		    function rstr2hex(input) {
		        var hex_tab = '0123456789abcdef',
		            output = '',
		            x,
		            i;
		        for (i = 0; i < input.length; i += 1) {
		            x = input.charCodeAt(i);
		            output += hex_tab.charAt((x >>> 4) & 0x0F) +
		                hex_tab.charAt(x & 0x0F);
		        }
		        return output;
		    }

		    /*
		    * Encode a string as utf-8
		    */
		    function str2rstr_utf8(input) {
		        return unescape(encodeURIComponent(input));
		    }

		    /*
		    * Take string arguments and return either raw or hex encoded strings
		    */
		    function raw_md5(s) {
		        return rstr_md5(str2rstr_utf8(s));
		    }
		    function hex_md5(s) {
		        return rstr2hex(raw_md5(s));
		    }
		    function raw_hmac_md5(k, d) {
		        return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
		    }
		    function hex_hmac_md5(k, d) {
		        return rstr2hex(raw_hmac_md5(k, d));
		    }
		    
		    return hex_md5(str);
	}
	
	function checkIdCard(idcard){
		var Errors=new Array(
		"pass",
		"身份证号码位数不对!",
		"身份证号码出生日期超出范围或含有非法字符!",
		"身份证号码校验错误!",
		"身份证地区非法!"
		);
		if(idcard.length!=15&&idcard.length!=18){
			return Errors[1];
		}
		var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",
				31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",
				43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",
				61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
		var retflag=false;
		var Y,JYM;
		var S,M;
		var ereg;
		var idcard_array = new Array();
		idcard_array = idcard.split("");
		// 地区检验
		if(area[parseInt(idcard.substr(0,2))]==null) return Errors[4];
		// 身份号码位数及格式检验
		switch(idcard.length){
		case 15:
		if ( (parseInt(idcard.substr(6,2))+1900) % 4 == 0 || ((parseInt(idcard.substr(6,2))+1900) % 
		100 == 0 && (parseInt(idcard.substr(6,2))+1900) % 4 == 0 )){
		ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;// 测试出生日期的合法性
		} else {
		ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;// 测试出生日期的合法性
		}
		if(ereg.test(idcard)) 
		return Errors[0];
		else 
		{
		 return Errors[2];
		}
		break;
		case 18:
		// 18位身份号码检测
		// 出生日期的合法性检查
		// 闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
		// 平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
		if ( parseInt(idcard.substr(6,4)) % 4 == 0 || (parseInt(idcard.substr(6,4)) % 100 == 0 && 
		parseInt(idcard.substr(6,4))%4 == 0 )){
		ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;
		// 闰年出生日期的合法性正则表达式
		} else {
		ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;
		// 平年出生日期的合法性正则表达式
		}
		if(ereg.test(idcard)){// 测试出生日期的合法性
		// 计算校验位
		S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
		+ (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
		+ (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
		+ (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
		+ (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
		+ (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
		+ (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
		+ parseInt(idcard_array[7]) * 1 
		+ parseInt(idcard_array[8]) * 6
		+ parseInt(idcard_array[9]) * 3 ;
		Y = S % 11;
		M = "F";
		JYM = "10X98765432";
		M = JYM.substr(Y,1);// 判断校验位
		if(M == idcard_array[17]||(M=='X'&&idcard_array[17]=='x')) return Errors[0]; // 检测ID的校验位
		else return Errors[3];
		}
		else return Errors[2];
		break;
		default:
		return Errors[1];
		break;
		}
		}
	function  checkPwd(pwd){
		var exp = /(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,25}/;
		if(pwd!=null&&pwd!=""){
			if(pwd.match(exp)){
				return 'true';
			}else{
				return 'false';
			}
		}
		return 'true';
	}
	
	
	function  checkUserName(userName){
		var expUser = '^\\w{6,25}$';
		if(userName!=null&&userName!=""){
			if(userName.match(expUser)){
				return 'true';
			}else{
				return 'false';
			}
		}
		return 'true';
	}
	
	function  checkMobile(mobile){
		var expMobile = /^1[3|4|5|7|8][0-9]\d{8}$/;
		if(mobile!=null&&mobile!=""){
			if(mobile.match(expMobile)){
				return 'true';
			}else{
				return 'false';
			}
		}
		return 'true';
	}
	
	function  checkNumber(num){
		var expNum = /^\d+$/;
		if(num!=null&&num!=""){
			if(num.match(expNum)){
				if(num<0){
					return 'false';
				}else{
					return 'true';
				}
			}else{
				return 'false';
			}
		}
		return 'true';
	}
	
	
	return {
		netpstPaging : netpstPaging,
		queryPaging : queryPaging,
		formatDate : formatDate,
		utf16to8 : utf16to8,
		getCitys : getCitys ,
		getCityName : getCityName ,
		formatStr : formatStr,
		md5 : md5,
		checkIdCard : checkIdCard,
		checkPwd : checkPwd,
		checkUserName : checkUserName,
		checkMobile : checkMobile,
		checkNumber : checkNumber
	};
});
