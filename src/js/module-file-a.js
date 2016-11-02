// - - - - - - - - - - - - - - - - - - - -

    // Export a named variable,
    export var var_a = {a:'module-file-a -> var_a'};

    // Export a named function:
    export function fn_a() {
        console.log('module-file-a -> fn_a()');
    }

// - - - - - - - - - - - - - - - - - - - -

    // Export the default variable/function:
    //      You can only have one default, if you have more than
    //      one, only first one is exported the rest is ignore

    var var_b;
    export default var_b = {a:'module-filea -> default var_b'};

