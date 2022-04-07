import React, { useContext } from "react";
import { useState, useEffect } from 'react';
import { Row, Col, Button, Modal, Popover, OverlayTrigger, Accordion } from 'react-bootstrap';
import { ethers, utils, BigNumber } from 'ethers';
import { TransactionContext } from "../context/TransactionContext";
import $ from 'jquery';

$(function(){

  $( "#whitepapper" ).click(function() {
    
    $('html,body').animate({scrollTop: $("#whitepapper-target").offset().top},'slow');
    
  });

    $("#show_airdrop_claim_button").css('display', 'none');
    $("#show_time_airdrop").css('display', 'none');
    $("#id_next_airdrop_starts_soon").css('display', 'none');
    $("#btn-easy-stake").prop('checked', true);

  var calcNewYear = setInterval(function(){
    var nextAirDrop = $("#id_nextAirDrop").val();
    if(nextAirDrop != ""){
      var date_future = new Date(nextAirDrop);
      var date_now = new Date();
      var seconds = Math.floor((date_future - (date_now))/1000);
      var minutes = Math.floor(seconds/60);
      var hours = Math.floor(minutes/60);
      var days = Math.floor(hours/24);
      
      hours = hours-(days*24);
      minutes = minutes-(days*24*60)-(hours*60);
      seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
      $("#next_airdrop_d").empty().append(days);
      $("#next_airdrop_h").empty().append(hours);
      $("#next_airdrop_m").empty().append(minutes);
      $("#next_airdrop_s").empty().append(seconds);
    }
    if($("#id_nextAirDropRaw").val() != ""){
      var airdropTimeStart = new Date(parseInt($("#id_nextAirDropRaw").val()));
      var DateNow = new Date().getTime() / 1000
      var airdropTimeEnd = new Date(parseInt($("#id_nextAirDropLimitDate").val()));
    }
  if((DateNow > airdropTimeStart)){
    $("#show_airdrop_claim_button").css('display', 'block');
    $("#show_time_airdrop").css('display', 'none');
    $("#id_next_airdrop_starts_soon").css('display', 'none');
  }else{
    $("#show_airdrop_claim_button").css('display', 'none');
    $("#show_time_airdrop").css('display', 'flex');
    $("#id_next_airdrop_starts_soon").css('display', 'none');
  }
  if((DateNow > airdropTimeEnd)){
    $("#show_airdrop_claim_button").css('display', 'none');
    $("#show_time_airdrop").css('display', 'none');
    $("#id_next_airdrop_starts_soon").css('display', 'block');
    
  }
  },1000);
});

$( document ).ready(function() {
  $("#id_show_price_sell").css('display', 'none');
  $('#form-stake-busd').submit(function() {
    var refAddress = $("#id_referrer_address").val();
    var amount_busd = $("#id_max_balance_busd_input").val();
    if(amount_busd == 0 || isNaN(amount_busd)){
      alert("The amount needs to be higher than 0");
      return false;
      }else{
     let referrer = new URLSearchParams(window.location.search).toString().replace(/address=/g, "");
     if( referrer != ""){
      $("#id_referrer_address").val(referrer);
     }
     return true;
    }
  });
  $('.form-stake-cfy').submit(function() {
    var amount_staking  = $("#id_max_balance_busdmk_input").val();
    if(amount_staking == 0 || isNaN(amount_staking)){
    alert("The amount needs to be higher than 0");
    return false;
    }else{
    return true;
    }
   
  });

  $('.form-sell-cfy').submit(function() {
    var amount_selling  = $("#id_max_balance_busdmk_input_sell").val();
    if(amount_selling == 0 || isNaN(amount_selling)){
    alert("The amount needs to be higher than 0");
    return false;
    }else{
    return true;
    }
   
  });

  
  $("#show_time_airdrop").css('display', 'none');
  $("#show_airdrop_claim_button").css('display', 'none');
  
  $('input').attr('name', 'time_lock').on('change', function(){
    var stake_apr_e = $("#TOKEN_DAILYPROFIT_E").val();
    var stake_apr_m = $("#TOKEN_DAILYPROFIT_M").val();
    var stake_apr_h = $("#TOKEN_DAILYPROFIT_H").val();
    var time_lock_stake = $(this);
    if(time_lock_stake.val() == 0){

      $("#apr_period").empty().append($("#TOKEN_DAILYPROFIT_E").val()+"%");
      $("#footer_text_rewards").empty().append("Stake your CFY tokens to earn a return of "+(stake_apr_e/365)+"% daily ("+stake_apr_e+"% APR). Your tokens will be locked for 10 days.");
      $(".btn-act").removeClass('btn-act');
      $("#btn-easy-stake-act").addClass('btn-act');

    }else if(time_lock_stake.val() == 1){
      $("#footer_text_rewards").empty().append("Stake your CFY tokens to earn a return of "+(stake_apr_m/365)+"% daily ("+stake_apr_m+"% APR). Your tokens will be locked for 20 days.");
      $("#apr_period").empty().append($("#TOKEN_DAILYPROFIT_M").val()+"%");
      $(".btn-act").removeClass('btn-act');
      $("#btn-medium-stake-act").addClass('btn-act');

    }else if(time_lock_stake.val() == 2){

      $("#apr_period").empty().append($("#TOKEN_DAILYPROFIT_H").val()+"%");
      $("#footer_text_rewards").empty().append("Stake your CFY tokens to earn a return of "+(stake_apr_h/365)+"% daily ("+stake_apr_h+"% APR). Your tokens will be locked for 30 days.");
      $(".btn-act").removeClass('btn-act');
      $("#btn-hard-stake-act").addClass('btn-act');

    }

  })

  $("#id_max_balance_busdmk_input_sell").on('input', function(){
    var tokenPrice = $("#CFY_Token_Price").val();
    var inputSell = $("#id_max_balance_busdmk_input_sell").val();
    if(inputSell != ""){
    $("#id_show_price_sell").css('display', 'block');
    $("#id_sell_you_receive").empty().append(parseFloat(inputSell*tokenPrice).toFixed(2)+" BUSD");
    }else{
      $("#id_show_price_sell").css('display', 'none');
    }

  });
    var stake_apr_e = 2190;
   
  $("#apr_period").empty().append(stake_apr_e+"%");
  $("#footer_text_rewards").empty().append("Stake your CFY tokens to earn a return of "+(stake_apr_e/365)+"% daily ("+stake_apr_e+"% APR). Your tokens will be locked for 10 days.");

  $("#id_max_balance_busd").click(function(){
      $("#id_max_balance_busd_input").val($(this).attr("data-total-amount").replace(/,/g, ""));

  });
  $("#id_max_balance_busdmk").click(function(){
    $("#id_max_balance_busdmk_input").val($(this).attr("data-total-amount").replace(/,/g, ""));
});
$("#id_max_balance_busdmk_sell").click(function(){
  $("#id_max_balance_busdmk_input_sell").val($(this).attr("data-total-amount").replace(/,/g, ""));
});


$(".btn-hover").mouseenter(function(){
  $(".btn-hover").removeClass('btn-hover-cfy');
  $(this).addClass('btn-hover-cfy');
});
$(".btn-hover").mouseleave(function(){
  $(".btn-hover").removeClass('btn-hover-cfy');
});

  $(".progress").each(function() {

    var value = $(this).attr('data-value');
    var left = $(this).find('.progress-left .progress-bar');
    var right = $(this).find('.progress-right .progress-bar');

    if (value > 0) {
      if (value <= 50) {
        right.css('transform', 'rotate(' + percentageToDegrees(value) + 'deg)');
      } else {
        right.css('display', 'none');
        right.css('transform', 'rotate(180deg)');
        left.css('transform', 'rotate(' + percentageToDegrees(value - 50) + 'deg)')
      }
    }

  })

  function percentageToDegrees(percentage) {

    return percentage / 100 * 360

  }

});




const Box1 = () => {
const { MODAL, handleShow, handleClose, show, BUSDMK_ADDRESS, claimWeeklyAirDrop, transactionCount, changeValueContract, CurrencyFormat, CurrencyFormatDecimals, BUSD, BUSDMK, USER, stakeBUSD, STAKE, stakeToken, getUserData, claimToken_M, claimToken_T, sellToken, unstakeToken, connectWallet } = useContext(TransactionContext);



const PopoverAirdrop = (
  <Popover>
    <Popover.Header as="h3" className="text-dark">Weekly Airdrops</Popover.Header>
    <Popover.Body>
      <h5>What are the weekly airdrops?</h5>
      <p>Everytime a new investor stake BUSD into the pool, 5% of that transaction will be transfered into locked treasury and then redistrubuted weekly for every users.</p>
      <h5>How do I participate?</h5>
      <p>You need to stake at least 100 BUSD into the pool</p>
    </Popover.Body>
  </Popover>
);  

const PopoverBUSD = (
  <Popover>
    <Popover.Header as="h3" className="text-dark">Earn CFY by staking BUSD</Popover.Header>
    <Popover.Body>
      <h6>How does it work?</h6>
      <p>Deposit your BUSD into the pool to earn a return of 4% daily in CFY tokens.</p>
      <h6>Can I remove my investment?</h6>
      <p>Once you deposited your BUSD into the pool you cannot remove it, the only way to recover your ROI will be on the rewarded CFY tokens that you will adquire by staking your BUSD.</p>
      <h6>Can I swap my CFY for BUSD?</h6>
      <p>Yes, once you have earned some CFY you can swap them for BUSD.</p>
    </Popover.Body>
  </Popover>
);  

const PopoverCFY = (
  <Popover>
    <Popover.Header as="h3" className="text-dark">Earn CFY by staking CFY</Popover.Header>
    <Popover.Body>
    <h6>How does it work?</h6>
      <p>Once you earned some CFY by staking BUSD, you can stake your CFY into this second pool.</p>
      <h6>How much do I earn?</h6>
      <p>You have three different options:</p>
      <ul>
        <li className="mb-4"><b>6% daily return (2190% APR)<br />10 days locked</b></li>
        <li className="mb-4"><b>8% daily return (2920% APR)<br />20 days locked</b></li>
        <li className="mb-4"><b>10% daily return (3650% APR)<br />30 days locked</b></li>
      </ul>
      <h6>Can I restake my rewards?</h6>
      <p>Yes, you can restake your rewards whenever you want to.</p>
      <h6>Can I sell my CFY before staking them?</h6>
      <p>Yes, feel free to swap your CFY tokens for BUSD anytime you want to.</p>
    </Popover.Body>
  </Popover>
); 

const PopoverSELL = (
  <Popover>
    <Popover.Header as="h3" className="text-dark">Swap CFY for BUSD</Popover.Header>
    <Popover.Body>
      <h6>How is the CFY price calculated?</h6>
      <p>The CFY token price is calculated by: <b style={{color:"red"}}>(Pending rewards * Total Liquidity Locked) = CFY price for BUSD</b></p>
      <h6>How much can I sell daily?</h6>
      <p>Each user can sell up to <b>10.000 CFY</b> tokens daily. And the maximum daily selling is up to <b>60.000 CFY</b> tokens.</p>
      <h6>Will those limits change in the future?</h6>
      <p>Yes, the protocol was created to be keep the limits flexible.</p>
    </Popover.Body>
  </Popover>
); 

const PopoverSTAKING = (
  <Popover>
    <Popover.Header as="h3" className="text-dark">My Staking pool</Popover.Header>
    <Popover.Body>
      <h6>What is it?</h6>
      <p>Here you can see every new staking you made and in how many days they will be released.</p>
    </Popover.Body>
  </Popover>
); 

const PopoverReferral = (
  <Popover>
    <Popover.Header as="h3" className="text-dark">Earn BUSD</Popover.Header>
    <Popover.Body>
      <h6>How does it work?</h6>
      <p>If someone comes into our webpage from your link and makes a deposit in BUSD, you earn 1.5% of that transaction in BUSD.</p>
      <h6>How many times do I earn?</h6>
      <p>Everytime! After his first transaction your address will be saved into his data and everytime he makes a new deposit you earn 1.5% of the amount he is depositing.</p>
      <p>Example: if someone deposits <b>500 BUSD</b> into our protocol <b>7.50 BUSD</b> will be automatically transfered to your wallet. And if after two months the same person makes a new deposit, again you earn!</p>
    </Popover.Body>
  </Popover>
); 

let TotalWeeklyAirdrop = BUSD.getBUSDWeeklyAirdrop/USER.TOTAL_USERS_AIRDROP;
if(isNaN(TotalWeeklyAirdrop)){
  TotalWeeklyAirdrop = 0;
}

let userAdddress = USER.userAddress;
let userAddressShorter = userAdddress.slice(0, 6)+"..."+userAdddress.slice(38);
const linkReferrel = "https://cryptofactory.online?address="+USER.userAddress;
return(

  

<Col xs={12} md={12} className="my-5">



      <Modal show={show} onHide={handleClose} onExited={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter"
      centered id="modal-warning">
        <Modal.Header closeButton>
        <Modal.Title>{MODAL.error == true ? <i className="fas fa-times icon-airdrop-out"></i> : <i className="far fa-check-circle icon-airdrop-in"></i> } {MODAL.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{MODAL.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>

<Row>
  <Col md={6}>
  <div className="dQdmym">
    <div className="dXbYox">
      <div className="dnJGkr">
      <div className="kEiMDz eycoH d-flex justify-content-evenly">
          <div className="etZQAu mx-2">
          <i className="fas fa-cog  color-icons"></i>
          
            </div>
            <div className="title-text  flex-grow-1 bd-highlight">CRYPTO FACTORY</div>
            <div className="">{USER.userAddress ?  <a className="box_color" href={"https://bscscan.com/address/"+USER.userAddress} target="_blank">{userAddressShorter}</a> : <button type="submit" className="gkTzQI dZAyIf fIqiLm btn-hover" onClick={() => connectWallet()}>Connect Wallet</button>}</div>
            </div>
      <hr className="sc-bqyKOL gSuxaX"></hr>
      <div className="kEiMDz">CFY Tokenomics</div>
      
      <ul className="jQcwXY">
        <li><div className="label">Total Liquidity Locked</div><div className="value">{CurrencyFormat(BUSD.totalBUSDStaked)} BUSD</div></li>
        <li><div className="label">Total Weekly Airdrop</div><div className="value">{CurrencyFormat(BUSD.getBUSDWeeklyAirdrop)} BUSD</div></li>
        <li><div className="label">CFY Token Price</div><div className="value">{CurrencyFormatDecimals(BUSDMK.TokenPrice, 6)} BUSD</div></li>
        <li><div className="label">Available Supply</div><div className="value">{CurrencyFormat(BUSDMK.AvailableSupply)} CFY</div></li>
        <li><div className="label">Circulating Supply</div><div className="value">{CurrencyFormat(BUSDMK.TotalSupply)} CFY</div></li>
        <li><div className="label">Total Max Supply</div><div className="value">{CurrencyFormat(BUSDMK.limitSupply)} CFY</div></li>
        <li><div className="label">Holders / Investors</div><div className="value">{BUSDMK.TotalUsers}</div></li>
        <li><div className="label">Contract</div><div className="value"><a target="_blank" href={"https://bscscan.com/address/"+BUSDMK_ADDRESS}>{BUSDMK_ADDRESS}</a></div></li></ul>
      </div>
    </div>
  </div>
  </Col>
  <Col md={6}>
  <div className="dQdmym">
    <div className="dXbYox">
      <div className="dnJGkr">
      <div className="kEiMDz eycoH d-flex justify-content-evenly">
          <div className="etZQAu mx-2">
          <i className="fas fa-cog  color-icons"></i>
            </div>
            <div className="title-text  flex-grow-1 bd-highlight">BUSD WEEKLY AIRDROP</div>
            <div className="">
            <OverlayTrigger trigger="click" placement="left" overlay={PopoverAirdrop}>
            <a href={void(0)}><i className="far fa-question-circle color-help"></i></a>
            </OverlayTrigger>
              </div>
            </div>
      <hr className="sc-bqyKOL gSuxaX"></hr>
      {USER.getIfUserIsAirdrop == "true" ?
      <div className="account_airdrop h5 mb-3"><i className="far fa-check-circle icon-airdrop-in"></i> <span>Your are earning weekly airdrops</span> </div>
      :
      <div className="account_airdrop h5 mb-3"><i className="fas fa-times icon-airdrop-out"></i> <span>You need to stake at least 100 BUSD to participate </span> </div>
}
<div className="faLlSK2 d-flex bd-highlight text-center mb-3">
<div className="flex-fill bd-highlight">
              <div className="title">My total earned:</div>
              <div className="amount" style={{fontSize:"1.3rem"}}>{CurrencyFormat(USER.getTotalAidropPaidUser)} BUSD</div>
            </div>
      <div className="flex-fill bd-highlight">
              <div className="title">Total Users:</div>
              <div className="amount" style={{fontSize:"1.3rem"}}>{USER.TOTAL_USERS_AIRDROP} USER(S)</div>
            </div>
            <div className="flex-fill bd-highlight">
              <div className="title">Next claim (you earn):</div>
              <div className="amount" style={{fontSize:"1.3rem"}}>{CurrencyFormat(TotalWeeklyAirdrop)} BUSD</div>
            </div>
            </div>
            {BUSD.getBUSDWeeklyAirdrop > 0 ?
            <div className="faLlSK mb-1" id="id_claim_timer_div">

                <Row className="div_countdown justify-content-evenly row" id="show_time_airdrop">
                  <div className="title text-center">Next claim in:</div>
                  <Col className="div_countdown_child"  md={4} sm={12}>
                    <span className="n" id="next_airdrop_d"></span>
                    <span className="t">DAYS</span>
                  </Col>
                  <Col className="div_countdown_child"  md={4} sm={12}>
                    <span className="n" id="next_airdrop_h"></span>
                    <span className="t">HOURS</span>
                  </Col>
                  <Col className="div_countdown_child"  md={4} sm={12}>
                    <span className="n"  id="next_airdrop_m"></span>
                    <span className="t">MINUTES</span>
                  </Col>
                  <Col className="div_countdown_child"  md={4} sm={12}>
                    <span className="n"  id="next_airdrop_s"></span>
                    <span className="t">SECONDS</span>
                  </Col>
                  <input type="hidden" style={{display:"none"}} name="nextAirDrop" id="id_nextAirDrop" defaultValue={BUSD.getUserTimeToNextAirdrop} />
                  <input type="hidden" style={{display:"none"}} name="nextAirDropRaw" id="id_nextAirDropRaw" defaultValue={BUSD.getUserTimeToNextAirdropRaw} />
                  <input type="hidden" style={{display:"none"}} name="nextAirDropLimitDate" id="id_nextAirDropLimitDate" defaultValue={BUSD.RETURN_AIRDROP_CLAIM_LIMIT} />
                </Row>
                <div className="value" id="id_next_airdrop_starts_soon">Next airdrop starts soon.</div>
              <div className="value"><button type="submit" id="show_airdrop_claim_button" className="gkTzQI dZAyIf fIqiLm btn-hover btn-claim" onClick={() => claimWeeklyAirDrop()}>Claim AIRDROP</button></div>
            </div> 
: ""}
      </div>
    </div>
  </div>
  </Col>
</Row>
  <Row>
    <Col md={4}>
    <div className="dnJGkr koHgEC">
        <div className="kEiMDz eycoH d-flex justify-content-evenly">
          <div className="etZQAu mx-2">
          <i className="fas fa-cog  color-icons"></i>
            </div>
            <div className="title-text  flex-grow-1 bd-highlight">DEPOSIT BUSD</div>
            <div className="">
            <OverlayTrigger trigger="click" placement="right" overlay={PopoverBUSD}>
            <a href={void(0)}><i className="far fa-question-circle color-help"></i></a>
            </OverlayTrigger>
            </div>
            </div>
            
            <div className="jSYiPb">
            {USER.getUserUnclaimedTokens_M > 0 ?
            <div className="faLlSK mt-3">
              <div className="title">Available to claim:</div>
              <div className="amount">{CurrencyFormatDecimals(USER.getUserUnclaimedTokens_M, 4)} CFY</div>
              <div className="value"><button type="submit" className="gkTzQI dZAyIf fIqiLm btn-hover btn-claim" onClick={() => claimToken_M()}>Claim CFY</button></div>
            </div> : "" }

            <form className="form-inline" id="form-stake-busd" onSubmit={e => stakeBUSD(e)}>
              <div className="sc-higWrZ fymMGo">

                <div className="qBBMa">
                  <div className="jSYiPb">
                    <div className="dVXwPo">
                      <div className="form-item">
                        <div className="label">Amount</div>
                      </div>
                      <div className="form-item">
                      <div className="label">Balance:</div>
                      <div className="value">{CurrencyFormat(USER.getBalanceBUSD)} BUSD</div>
                      
                    </div>
                  </div>
                  <div className="dVXwPo">
                    <input className="dlHZKJ deposit-input" type="value" name="amount" id="id_max_balance_busd_input" />
                    
                    <button type="button" className="gkTzQI gvavkQ btn-hover" id="id_max_balance_busd" data-total-amount={CurrencyFormat(USER.getBalanceBUSD)}>Max</button>
                  </div>
                  <div className="dVXwPo">
                    <div className="form-item">
                      <div className="label">APR:</div>
                      <div className="value">{BUSD.BUSD_DAILYPROFIT*365/10}%</div>
                    </div>
                    <div className="form-item">
                      <div className="label">Total staked:</div>
                      <div className="value">{CurrencyFormat(USER.getUserBUSDStaked)} BUSD</div>
                    </div>
                    </div>
                    <hr className="gSuxaX" />
                    <p className="footer-text">Stake BUSD to earn a return of 4% daily (1460% APR) in CFY tokens</p>
                  </div>
                </div>
              </div>
              <button type="submit" className="gkTzQI dZAyIf fIqiLm btn-hover">STAKE BUSD</button>
              <input type="hidden" name="referrer" id="id_referrer_address" defaultValue={USER.getUserReferrer} />
            </form>




        
        
        
        </div>
      </div>
    </Col>
    <Col md={4}>
    <div className="dnJGkr koHgEC">
    <div className="kEiMDz eycoH d-flex justify-content-evenly">
          <div className="etZQAu mx-2">
          <i className="fas fa-cog  color-icons"></i>
            </div>
            <div className="title-text  flex-grow-1 bd-highlight">STAKE CFY</div>
            <div className="">
            <OverlayTrigger trigger="click" placement="right" overlay={PopoverCFY}>
            <a href={void(0)}><i className="far fa-question-circle color-help"></i></a>
            </OverlayTrigger>
            </div>
            </div>
            <div className="jSYiPb">
            {USER.getUserUnclaimedTokens_T > 0 ?
            <div className="faLlSK mt-3">
              <div className="title">Available to claim:</div>
              <div className="amount">{CurrencyFormatDecimals(USER.getUserUnclaimedTokens_T, 4)} CFY</div>
              <div className="value"><button type="submit" className="gkTzQI dZAyIf fIqiLm btn-hover btn-claim" onClick={() => claimToken_T()}>Claim CFY</button></div>
            </div> : ""}

            <form className="form-inline form-stake-cfy" onSubmit={e => stakeToken(e)}>
              <div className="sc-higWrZ fymMGo">
                

                <div className="row d-flex text-center my-2 ">
                  <div className="btn-group my-2 gRppyE" role="group" aria-label="First group">
                  <input type="radio" value="0" className="btn-stake-timing btn-check" name="time_lock" id="btn-easy-stake" />
                  <label className="btn-hover gkTzQI btn-locked tab-button spWxX dZAyIf fIqiLm btn-staking-time btn-act" id="btn-easy-stake-act" htmlFor="btn-easy-stake">10 DAYS</label>
                    
                  <input type="radio" value="1" className="btn-stake-timing btn-check" name="time_lock" id="btn-medium-stake" />
                  <label className="btn-hover gkTzQI btn-locked tab-button spWxX dZAyIf fIqiLm btn-staking-time" id="btn-medium-stake-act" htmlFor="btn-medium-stake">20 DAYS</label>

                  <input type="radio" value="2" className="btn-stake-timing btn-check" name="time_lock" id="btn-hard-stake" />
                  <label className="btn-hover gkTzQI btn-locked tab-button spWxX dZAyIf fIqiLm btn-staking-time" id="btn-hard-stake-act" htmlFor="btn-hard-stake">30 DAYS</label>
                  
                  </div>


                </div>
                <div className="qBBMa">
                  <div className="jSYiPb">
                    <div className="dVXwPo">
                      <div className="form-item">
                        <div className="label">Amount</div>
                      </div>
                      <div className="form-item">
                      <div className="label">Balance:</div>
                      <div className="value">{CurrencyFormat(USER.getBalanceBUSDMK)} CFY</div>
                    </div>
                  </div>
                  <div className="dVXwPo">
                    <input className="dlHZKJ deposit-input" type="value" name="amount" id="id_max_balance_busdmk_input" />
                    <button type="button" className="gkTzQI gvavkQ btn-hover"  id="id_max_balance_busdmk" data-total-amount={USER.getBalanceBUSDMK}>Max</button>
                  </div>
                  <div className="dVXwPo">
                    <div className="form-item">
                      <div className="label">Est APR:</div>
                      <div className="value" id="apr_period"></div>
                    </div>
                    <input type="hidden" value={BUSDMK.TOKEN_DAILYPROFIT_E*365/10} id="TOKEN_DAILYPROFIT_E" />
                    <input type="hidden" value={BUSDMK.TOKEN_DAILYPROFIT_M*365/10} id="TOKEN_DAILYPROFIT_M" />
                    <input type="hidden" value={BUSDMK.TOKEN_DAILYPROFIT_H*365/10} id="TOKEN_DAILYPROFIT_H" />
                    <div className="form-item">
                      <div className="label">Total staked:</div>
                      <div className="value">{CurrencyFormat(USER.getUserTokenStaked)} CFY</div>
                    </div>
                    </div>
                    <hr className="gSuxaX" />
                    <p className="footer-text" id="footer_text_rewards"></p>
                  </div>
                </div>
              </div>
              <button type="submit" className="gkTzQI dZAyIf fIqiLm btn-hover">STAKE CFY</button>
            </form>
        </div>
      </div>
    </Col>
    <Col md={4}>
    <div className="dnJGkr koHgEC">
    <div className="kEiMDz eycoH d-flex justify-content-evenly">
          <div className="etZQAu mx-2">
          <i className="fas fa-cog  color-icons"></i>
            </div>
            <div className="title-text  flex-grow-1 bd-highlight">SELL CFY</div>
            <div className="">
            <OverlayTrigger trigger="click" placement="left" overlay={PopoverSELL}>
            <a href={void(0)}><i className="far fa-question-circle color-help"></i></a>
            </OverlayTrigger>
              </div>
            </div>
            <div className="jSYiPb">
            <form className="form-inline form-sell-cfy" onSubmit={e => sellToken(e)}>
              <div className="sc-higWrZ fymMGo">
                <div className="qBBMa">
                  <div className="jSYiPb">
                    <div className="dVXwPo">
                      <div className="form-item">
                        <div className="label">Amount</div>
                      </div>
                      <div className="form-item">
                      <div className="label">Available:</div>
                      <div className="value">{CurrencyFormat(USER.getBalanceBUSDMK)} CFY</div>
                    </div>
                  </div>
                  <div className="dVXwPo">
                    <input className="dlHZKJ deposit-input" type="value" name="amount" id="id_max_balance_busdmk_input_sell" />
                    <button type="button" className="gkTzQI gvavkQ btn-hover"  id="id_max_balance_busdmk_sell" data-total-amount={USER.getBalanceBUSDMK}>Max</button>
                  </div>
                  <input type="hidden" name="tokenPrice" id="CFY_Token_Price" defaultValue={BUSDMK.TokenPrice} />
                  <div className="faLlSK mt-3" id="id_show_price_sell">
              <div className="title text-center">You will receive approximately:</div>
              <div className="amount" id="id_sell_you_receive">{CurrencyFormat(USER.getUserUnclaimedTokens_T)} BUSD</div>
            </div>
                    <hr className="gSuxaX" />
                    
                  </div>
                </div>
              </div>
              <button type="submit" className="gkTzQI dZAyIf fIqiLm btn-hover ">Sell CFY</button>
            </form>
        </div>
        
        <div className="dVXwPo mt-5">
                    <div className="form-item">
                      <div className="label">User 24h limit sell:</div>
                      <div className="value">{CurrencyFormat(USER.getTokenSoldTodaybyUser)} / {CurrencyFormat(BUSDMK.BUSDMK_SELL_LIMIT_DAILY_USER)} CFY</div>
                    </div>
                    </div>
                    <div className="dVXwPo">
                    <meter className="progress-indicator bar-meter" id="fuel" min="0" max={BUSDMK.BUSDMK_SELL_LIMIT_DAILY_USER} low="1000" high="8000" optimum="5000" value={USER.getTokenSoldTodaybyUser}></meter>
                    </div>
                    <div className="dVXwPo">
                    <div className="form-item">
                      <div className="label">Community 24h limit sell:</div>
                      <div className="value">{CurrencyFormat(BUSDMK.getTokenSoldToday)} / {CurrencyFormat(BUSDMK.BUSDMK_SELL_LIMIT)} CFY</div>
                    </div>
                    </div>
                    <div className="dVXwPo">
                    <meter className="progress-indicator bar-meter" id="fuel" min="0" max="60000" low="15000" high="45000" optimum="30000" value={BUSDMK.getTokenSoldToday}></meter>
                    </div>
      </div>
    </Col>
  </Row>
  

  <Row className="my-3">
    <Col>

    <div className="sc-iktFfs ixkFue">
    <div className="kEiMDz eycoH d-flex justify-content-evenly mb-5">
          <div className="etZQAu mx-2">
          <div className="etZQAu mx-2">
          <i className="fas fa-cog  color-icons"></i>
            </div>
            </div>
            <div className="title-text  flex-grow-1 bd-highlight">MY STAKING(S)</div>
            <div className="">
            <OverlayTrigger trigger="click" placement="left" overlay={PopoverSTAKING}>
            <a href={void(0)}><i className="far fa-question-circle color-help"></i></a>
            </OverlayTrigger> 
             </div>
            </div>
      <div role="table" aria-label="pools" className="sc-jJEKmz hKXwnC">
        <header className="sc-hiSbEG gGANeH table-header table-row" role="rowgroup">
          <div className="kYkWHu" role="columnheader">Pool</div>
          <div className="kYkWHu" role="columnheader">Amount</div>
          <div className="kYkWHu" role="columnheader">APR</div>
          <div className="kYkWHu" role="columnheader">Unlock</div>
          <div className="kYkWHu" role="columnheader">Rewards</div>
          <div className="kYkWHu table-col" role="columnheader"></div>
        </header>
{
    Object.keys(STAKE).map((item, j) => ( //KEEP HERE
        <div className="kvFLhN" key={j}>
          <div className="jInVYo table-col" role="cell">
            <div className="sc-eLgNKc faXfXC">
              <div className="etZQAu">
              <i className="fas fa-cog  color-icons"></i>
              <span className="label mx-3">CFY STAKING</span>
              </div>
              
            </div>
          </div>
          <div className="jInVYo table-col" role="cell">
            <div className="sc-ehSDrC dmIEjQ">{ CurrencyFormat(STAKE[item].amount) } CFY</div>
          </div>
          <div className="jInVYo table-col" role="cell">{ (STAKE[item].period/10*365)+"%" }</div>
          <div className="jInVYo table-col" role="cell">{ STAKE[item].start } day(s)
          <div className="fIHfjH">
            
            <meter className="progress-indicator" id="fuel" min="0" max={ (STAKE[item].totalDays) } value={ (STAKE[item].totalDaysLocked) }></meter>
          </div>
        </div>
        <div className="jInVYo">
          <div id="pool-reward" className="faXfXC">
            <div className="etZQAu">
            { CurrencyFormatDecimals(STAKE[item].rewards, 6) } CFY</div>
          </div>
        </div>
        <div className="jInVYo">
        {
         STAKE[item].totalDays == 0 ? <button className="gkTzQI dZAyIf fIqiLm btn-hover" onClick={() => unstakeToken(STAKE[item].id)}>
         UNSTAKE CFY
       </button>:""}
        </div>
      </div>
      ))
     
}

      </div>
    </div>    
    
    </Col>
  </Row>
  <Row>
  <Col md={12}>
  <div className="dQdmym">
    <div className="dXbYox">
      <div className="dnJGkr">
      <div className="kEiMDz eycoH d-flex justify-content-evenly">
          <div className="etZQAu mx-2">
          <i className="fas fa-cog  color-icons"></i>
            </div>
            <div className="title-text  flex-grow-1 bd-highlight">REFERRAL CODE</div>
            
            <div className="mx-5">
              </div>
              <div className="">
            <OverlayTrigger trigger="click" placement="left" overlay={PopoverReferral}>
            <a href={void(0)}><i className="far fa-question-circle color-help"></i></a>
            </OverlayTrigger>
            </div>
            </div>
      <hr className="sc-bqyKOL gSuxaX"></hr>
      <div className="kEiMDz"></div>
      <div className="faLlSK mt-3">
              <div className="title">Total earned:</div>
              <div className="amount">{USER.getTotaReferralBonus} BUSD</div>
              
  
              <div className="title">Invite your friends and earn 1.5% of their expenses in BUSD</div>
              <div className="referrel_code"><a target="_blank" href={linkReferrel}>{linkReferrel}</a></div>
            </div>
    
      
      </div>
    </div>
  </div>
  </Col>
  </Row>

  <Row>
  <Col md={12}  id="whitepapper-target">
  <div className="dQdmym">
    <div className="dXbYox">
      <div className="dnJGkr">
      <div className="kEiMDz eycoH d-flex justify-content-evenly">
          <div className="etZQAu mx-2">
          <i className="fas fa-cog  color-icons"></i>
            </div>
            <div className="title-text  flex-grow-1 bd-highlight"  >Whitepapper</div>
            
            <div className="mx-5">
              </div>
              <div className="">
            <OverlayTrigger trigger="click" placement="left" overlay={PopoverReferral}>
            <a href={void(0)}><i className="far fa-question-circle color-help"></i></a>
            </OverlayTrigger>
            </div>
            </div>
      <hr className="sc-bqyKOL gSuxaX"></hr>
      <div className="kEiMDz"></div>
      <Accordion defaultActiveKey="0" flush className="b-accordion">
  <Accordion.Item eventKey="0">
    <Accordion.Header>Connect my account</Accordion.Header>
    <Accordion.Body>
<p>If you have the Metamask wallet already installed in your computer, change the network to BSC (Binance Smart Chain).</p>
<p>Select the account you would like to connect into our Dapp and click on &ldquo;Connect&rdquo; on the top right of our page.</p>

    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="1">
    <Accordion.Header>Stake BUSD to earn CFY tokens</Accordion.Header>
    <Accordion.Body>
<p>Connect your account (read section &ldquo;<strong>Connect my account</strong>&rdquo;).</p>
<p>In the "Deposit BUSD" section, select the amount you would like to invest and click in Stake BUSD, a Metamask window will pop up twice, click on Approve on the first window, then on the second window click on Confirm, then just wait for the transaction to be processed by the blockchain.</p>
<p>If the transaction was successful, you will see the amount you just deposited below the input field. You will then receive hourly rewards in CFY tokens that you can use for earning more CFY tokens on the &ldquo;Stake CFY&rdquo; session. The currently APR for staking BUSD is 1460% (4% daily), but keep in mind that this value can change in the future.</p>
      est laborum.
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="2">
    <Accordion.Header>Stake CFY tokens</Accordion.Header>
    <Accordion.Body>
<p>Connect your account (read section &ldquo;<strong>Connect my account</strong>&rdquo;).</p>
<p>In the "STAKE CFY" section, enter the amount of CFY tokens you would like to stake, and then choose the amount of days that you would like to lock your investment. Your browser wallet will pop up to confirm the transaction, click Confirm and wait for the transaction to be processed by the blockchain.</p>
<p>Remember that, the longer you lock it the higher are the rewards you will get for staking:</p>
<ul>
<li>10 days locked = APR 2190% (6% daily)</li>
<li>20 days locked = APR 2920% (8% daily)</li>
<li>30 days locked = APR 3650% (10% daily)</li>
</ul>
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="3">
    <Accordion.Header>Unstake CFY tokens</Accordion.Header>
    <Accordion.Body>
<p>Connect your account (read section &ldquo;<strong>Connect my account</strong>&rdquo;).</p>
<p>In the "My Staking(s)" section, choose the investment that you would like to unstake, if the limit locked is already completed you will find a button on the right side of that investment. Your browser wallet will pop up to confirm the transaction, click Confirm and wait for the transaction to be processed by the blockchain.</p>
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="4">
    <Accordion.Header>Sell CFY tokens</Accordion.Header>
    <Accordion.Body>
<p>Connect your account (read section &ldquo;<strong>Connect my account</strong>&rdquo;).</p>
<p>In the "SELL CFY" section, enter the amount to sell and click "SELL CFY". Your browser wallet will pop up to confirm the transaction, click Confirm and wait for the transaction to be processed by the blockchain.</p>
<p>Note that: the daily limit-sell per is user is up to 10,000 CFY tokens and 60,000 CFY tokens for the whole community.</p>
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="5">
    <Accordion.Header>CFY Tokenomics</Accordion.Header>
    <Accordion.Body><p>To understand how the price is calculated you need to understand what&rsquo;s <strong>Total Max Supply</strong> (the total max amount of tokens that can ever exist), <strong>Circulating Supply</strong> (the amount of tokens already created), <strong>Available Supply</strong> (the amount of tokens that can still be created before reaching the total max supply) and <strong>Total Liquidity Locked</strong> (the amount of BUSD deposited into the Dapp).</p>
<p>The CFY token were deployed with a total max supply of 1,000,000 tokens, which means that 1,000,000 tokens are the maximum amount of CFY tokens that can be in circulation.</p>
<p>When CFY token were deployed, only 1% of the total max supply were created, which means, only 10,000 CFY tokens were existing, and then the only way to create new tokens is by staking BUSD into the Dapp and then earning daily rewards in CFY tokens.</p>
<p>Every time someone deposits BUSD into the Dapp, 1.5% is the protocol fee and 5% goes to the BUSD Weekly Airdrop (read section &ldquo;<strong>BUSD Weekly Airdrop&rdquo;</strong>).</p>
<p>Example: if someone deposits 100 BUSD into the Dapp:</p>
<ul>
<li>1,5 BUSD goes to the <strong>Developer of CFY</strong></li>
<li>5 BUSD goes to the <strong>Weekly Airdrop Pool</strong></li>
<li>93,5 BUSD goes to the <strong>Total Liquidity Locked</strong></li>
</ul>
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="6">
    <Accordion.Header>Price Mechanics</Accordion.Header>
    <Accordion.Body><p>The price of each CFY token is calculated like this: (<strong>Total Liquidity Locked</strong> / <strong>Available Supply</strong>)</p>
<p>As more BUSD is staked into the Dapp, more CFY tokens will be created and distributed to the investors. That will rise the price of each CFY token because there will be less CFY tokens available from the total max supply.</p>
<p>As less tokens are in the <strong>Available Supply</strong>, more people will sell their positions and less <strong>Total Liquidity Locked</strong> will be available in the protocol, what could hurt newer investors, but to protect the them from liquidation, the Dapp will always control the price of CFY tokens, keeping them in balance with the total liquidity locked, this will maintain the economical long term sustainability.</p>
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="7">
    <Accordion.Header>BUSD weekly airdrop</Accordion.Header>
    <Accordion.Body><p>5% of every BUSD invested into the Dapp will be allocated to the weekly airdrop pool, which will distribute them equally to all the investors in the protocol. But keep in mind that to participate of this weekly airdrop, you first need to stake at least 100 BUSD in the protocol.</p>
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="8">
    <Accordion.Header>BUSD weekly airdrop</Accordion.Header>
    <Accordion.Body><p>Every time you bring a new person to this Dapp through your link, you receive permanently 1.5% of their transaction from the section &ldquo;DEPOSIT BUSD&rdquo;.</p>
    </Accordion.Body>
  </Accordion.Item>

</Accordion>
    
      
      </div>
    </div>
  </div>
  </Col>
  </Row>
  

  

     
    </Col>
)
};

export default Box1;
