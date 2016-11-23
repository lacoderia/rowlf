function User(id, name, email) {

    // Private attributes
    var _id = undefined;
    var _name = undefined;
    var _email = undefined;

    /**
     *
     * @param id
     * @param name
     * @param email
     *
     */

    this.constructor = function(id, name, email) {
        this.setId(id);
        this.setName(name);
        this.setEmail(email);
    };

    /**
     *
     * @returns {undefined}
     */
    this.getId = function(){
        return _id;
    };

    /**
     *
     * @param id
     */
    this.setId = function(id){
        _id = id;
    };

    /**
     *
     * @returns {undefined}
     */
    this.getName = function(){
        return _name;
    };

    /**
     *
     * @param name
     */
    this.setName = function(name){
        _name = name;
    };

    /**
     *
     * @returns {undefined}
     */
    this.getEmail = function(){
        return _email;
    };

    /**
     *
     * @param email
     */
    this.setEmail = function(email){
        _email = email;
    };

    this.constructor(id, name, email);

};