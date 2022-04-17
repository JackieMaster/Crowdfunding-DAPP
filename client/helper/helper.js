
import moment from "moment";
import web3 from "web3";
import _ from 'lodash';

export const weiToEther = (num) =>{
    return web3.utils.fromWei(num, 'ether')
}

export const etherToWei = (num) => {
  const weiBigNumber = web3.utils.toWei(num, 'ether');
  const wei = weiBigNumber.toString();
  return wei
}

export const unixToDate = (unixDate) =>{
  return moment(unixDate).format("DD/MM/YYYY");
}

export const state = ["Fundraising","Expired","Successful"];

export const projectDataFormatter = (data,contractAddress) =>{
  const formattedData = {
    address:contractAddress,
    title:data.title,
    description:data.desc,
    minContribution:weiToEther(data.minContribution),
    goalAmount:weiToEther(data.goalAmount),
    currentAmount:weiToEther(data.currentAmount),
    state:state[Number(data.currentState)],
    deadline:unixToDate(Number(data.projectDeadline)),
    progress:Math.round((Number(weiToEther(data.currentAmount))/Number(weiToEther(data.goalAmount)))*100)
  }
  return formattedData;
}

const formatContribution = (contributions) =>{
  const formattedData = contributions.map(data=>{
    return {
      contributor:data.returnValues.contributor,
      amount:Number(weiToEther(data.returnValues.amount))
    }
  })
  return formattedData;
}

export const groupContributors = (contributions) => {
  const contributorList = formatContribution(contributions);
  const contributorGroup = _.map(_.groupBy(contributorList, 'contributor'), (o,address) => { return { contributor: address,amount: _.sumBy(o,'amount') }})
  return contributorGroup;
}