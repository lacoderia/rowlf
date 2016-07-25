function User(id, firstName, lastName, email) {

    // Private attributes
    var _id = undefined;
    var _firstName = undefined;
    var _lastName = undefined;
    var _email = undefined;

    /**
     *
     * @param id
     * @param firstName
     * @param lastName
     * @param email
     *
     */

    this.constructor = function(id, firstName, lastName, email) {
        this.setId(id);
        this.setFirstName(firstName);
        this.setLastName(lastName);
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
    this.getFirstName = function(){
        return _firstName;
    };

    /**
     *
     * @param firstName
     */
    this.setFirstName = function(firstName){
        _firstName = firstName;
    };

    /**
     *
     * @returns {undefined}
     */
    this.getLastName = function(){
        return _lastName;
    };

    /**
     *
     * @param lastName
     */
    this.setLastName = function(lastName){
        _lastName = lastName;
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

    this.constructor(id, firstName, lastName, email);

};