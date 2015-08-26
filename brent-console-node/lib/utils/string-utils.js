/**
 * Created by xiongxing on 2014/8/8.
 *
 */

module.exports ={
    trim : function(str){
        if(!str)
            return '';

        return str.replace(/\s/ig,'');
    }
}