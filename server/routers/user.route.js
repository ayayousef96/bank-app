const express = require("express");
const User = require("../models/User");
const router = express.Router();

//add user
router.post("/api/users", async (req, res) => {
    try {
      let user = new User(req.body);
      await user.save();
      res.status(200).send(user);
    }
    catch (e) {
      res.status(400).send("Error! " + e.message);
    }
  });

  
  //get all users
  router.get("/api/users", async (req, res) => {
    try {
      const users = await User.find({});
      res.status(200).send(users);
    } 
    catch (e) {
      res.status(400).send("Error! " +e.message);
    }
  });

  //deposite
 //router.patch("/api/users/deposite/:id", HandleDeposite);

 //add credit amount to the user 
router.patch("/api/users/credit/:id", handleCredit);

async function handleCredit(req, res){
    const _id = req.params.id;
    const amount = req.body.amount;
 
    if (amount < 0) res.status(404).send("Can't update credit with negative number");

    try{
        const user = await User.findById(_id);
        if (!user) return res.status(404).send("user not found");
        const editedUser = creditUser(user, amount);
        const updatedUser = await User.findByIdAndUpdate(_id, editedUser, {
        new: true,
        runValidators: true,
    });

    if (!updatedUser) return res.status(404).send();
    res.status(200).send(updatedUser);

    }catch(e){
        res.status(400).send(e.message);
    }

}

function creditUser(user, moneyAmount){
    const newUser = {
        passID: user.passID,
        cash: user.cash,
        credit: user.credit + moneyAmount,
      };
      return newUser;
}

//withdraw money from user
router.patch("/api/users/withdraw/:id", HandleWithdraw);

async function HandleWithdraw (req, res){

    const _id = req.params.id;
    const amount = req.body.amount;
    console.log(amount);

    try{

        const user = await User.findById(_id);
        //console.log(user.cash + user.credit);
        if (!user){
            return res.status(404).send("user not found!");
        } 
        if ((user.cash + user.credit) > amount) {
           usr = check_money_enough(user, amount);
            const updatedUser = await User.findByIdAndUpdate(_id,usr, {
                new: true,
                runValidators: true,
            })
            if (!updatedUser){ 
                return res.status(404).send();
            }
            res.status(200).send(updatedUser);
        }
        else{
            res.status(400).send("Not enough money");
        }

    }
    catch(e){
            res.status(400).send(e.message);
        }
}

 function check_money_enough(usr, moneyAmount) {

    usr = {
            passID:usr.passID, 
            cash: usr.cash - moneyAmount,
            credit: usr.credit
        };
  
    if (usr.cash < 0)
      usr = {
        passID: usr.passID,
        credit: usr.credit + usr.cash,
        cash: 0,
      };
  
    return usr;
  }

//transfer
  router.patch("/api/users/transfer/:id", HandleTransfer);

  async function HandleTransfer (req, res){
    
    const amount = req.body.amount;
    const _IdTransfer = req.params.id;
    const _Idrecevier = req.body.id;
  

    if (amount < 0){
        res.status(404).send("Error : Can't transfer negative money amount!");
    }
 
    try{

        const transfer = await User.findById(_IdTransfer);
        const recevier = await User.findById(_Idrecevier);
        if(!(transfer || recevier)){ 
            return res.status(404).send("user not found");
        }

        if (transfer.cash + transfer.credit > amount) {
            tranferUser = check_money_enough(transfer, amount);
            reciverUser = { passID:recevier.passID, cash:recevier.cash, credit: recevier.credit + amount };

            const updatedTrans = await User.findByIdAndUpdate(_IdTransfer, tranferUser, {
                new: true,
                runValidators: true,
            })

            const updatedrecevier = await User.findByIdAndUpdate(_Idrecevier, reciverUser, {
                new: true,
                runValidators: true,
            })

            res.status(200).send([updatedTrans , updatedrecevier]);
        }
        else {
            res.status(404).send("Not enough money");
        }
        
    }
    catch(e){
        res.status(400).send(e.message);
    }
  }


  router.patch("/api/users/deposite/:id", HandleDeposite);

async function HandleDeposite(req, res) {
  const _id = req.params.id;
  const amount = req.body.amount;
  console.log("amount", amount);
  try {
    const user = await User.findById(_id);
    if (!user) return res.status(404).send("user not found");
    const editedUser =  {
        passportID: user.passportID,
        cash: user.cash + moneyAmount,
        credit: user.credit,
      };
    const updatedUser = await User.findByIdAndUpdate(_id, editedUser, {
        new: true,
        runValidators: true,
    });

    if (!updatedUser) return res.status(404).send();
    res.status(200).send(updatedUser);

  } 
  catch (e) {
    res.status(400).send(e.message);
  }
}

