import mongoose from 'mongoose'

const tax_masterScheme = new mongoose.Schema({
    code : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true
    }
},{timestamps : true})


const tax_master = mongoose.model('tax_master',tax_masterScheme);


const occupation_masterScheme = new mongoose.Schema({
    code : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true
    }
},{timestamps : true})


const occupation_master = mongoose.model('occupation_master',occupation_masterScheme);

const holdingNature_masterScheme = new mongoose.Schema({
    code : {
        type : String,
        required : true
    },
    details : {
        type : String,
        required : true
    }
},{timestamps : true})


const holding_nature_master = mongoose.model('holding_nature_master',holdingNature_masterScheme);

const panExemptCat_masterScheme = new mongoose.Schema({
    code : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    }
},{timestamps : true})


const pan_exemptcat_master = mongoose.model('pan_exemptcat_master',panExemptCat_masterScheme);

const guardianRelation_masterScheme = new mongoose.Schema({
    code : {
        type : String,
        required : true
    },
    value : {
        type : String,
        required : true
    },
    applicableFor : {
        type : String,
        required : true
    },
    isGuardian : {
        type : Boolean,
        required : true
    }
},{timestamps : true})


const nomineeandguardrel_masters = mongoose.model('nomineeandguardrel_masters',guardianRelation_masterScheme);

export {tax_master,occupation_master,holding_nature_master,pan_exemptcat_master,nomineeandguardrel_masters};