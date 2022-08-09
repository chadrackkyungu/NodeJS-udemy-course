//* Front-end Route controller

exports.getOverview = (req, res) => {
    res.status(200).render('overview', {
        title: 'All Tours'
    })
}
exports.getTour = (req, res) => {
    res.status(200).render('tour', {
        title: 'All Tours'
    })
}
