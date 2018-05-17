const sortBy = require('lodash/sortBy')
const configManager = require('../../managers/config')
const Handler = require('./handler')

class VoteHandler extends Handler {
  /**
   * Check if the transaction can be applied to the wallet.
   * @param  {Wallet} wallet
   * @param  {Transaction} transaction
   * @return {Boolean}
   */
  canApply (wallet, transaction) {
    if (!super.canApply(wallet, transaction)) {
      return false
    }

    let applicableVotes = 0
    const votes = this.__sort(transaction)

    votes.forEach(vote => {
      if (vote.startsWith('-') && wallet.votes.includes(vote.slice(1))) {
        applicableVotes++
      }

      if (vote.startsWith('+') && !wallet.votesExceeded) {
        applicableVotes++
      }
    })

    return applicableVotes === votes.length
  }

  /**
   * Apply the transaction to the wallet.
   * @param  {Wallet} wallet
   * @param  {Transaction} transaction
   * @return {void}
   */
  apply (wallet, transaction) {
    this.__sort(transaction).forEach(vote => {
      this.__determineExcessiveVotes(wallet)

      if (vote.startsWith('+') && this.__canVoteFor(wallet, vote.slice(1))) {
        wallet.votes.push(vote.slice(1))
      }

      if (vote.startsWith('-')) {
        wallet.votes = wallet.votes.filter(item => (item !== vote.slice(1)))
      }

      this.__determineExcessiveVotes(wallet)
    })
  }

  /**
   * Revert the transaction from the wallet.
   * @param  {Wallet} wallet
   * @param  {Transaction} transaction
   * @return {void}
   */
  revert (wallet, transaction) {
    this.__sort(transaction).forEach(vote => {
      this.__determineExcessiveVotes(wallet)

      if (vote.startsWith('+')) {
        wallet.votes = wallet.votes.filter(item => (item !== vote.slice(1)))
      }

      if (vote.startsWith('-') && this.__canVoteFor(wallet, vote.slice(1))) {
        wallet.votes.push(vote.slice(1))
      }

      this.__determineExcessiveVotes(wallet)
    })
  }

  /**
   * Determine whether the wallet has exceeded the number of active votes.
   * @param  {Wallet} wallet
   * @return {void}
   */
  __determineExcessiveVotes (wallet) {
    wallet.votesExceeded = wallet.votes.length >= configManager.getConstant('activeVotes')
  }

  /**
   * Determine whether the wallet can vote for the given delegate.
   * @param  {Wallet} wallet
   * @param  {String} publicKey
   * @return {Boolean}
   */
  __canVoteFor (wallet, publicKey) {
    return !wallet.votes.includes(publicKey) && !wallet.votesExceeded
  }

  /**
   * Sort the votes of the transaction from unvotes to votes.
   * @return {[type]} [description]
   */
  __sort (transaction) {
    return sortBy(transaction.asset.votes, [vote => {
      return vote.startsWith('+')
    }])
  }
}

module.exports = new VoteHandler()