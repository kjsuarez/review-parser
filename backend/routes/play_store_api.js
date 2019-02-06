var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/play-store-search/:keyword', function (req, res, next) {

  // const opts = {
  // 	query: {
  // 		entity: 'software',
  // 		limit: 10
  // 	}
  // };
  // // console.log(req.query);
  // itunesSearchApi(req.params.keyword, opts).then(result => {
  //   result = appStoreApiToucher.preanSearchResults(result)
  //   result = appStoreApiToucher.narrowResult(req.params.keyword, result)
  //   res.status(200).json({
  //     message: 'success',
  //     obj: result
  //   });
  // });

  res.status(200).json({
    message: 'success',
    obj: [{trackName: "moo"}, {trackName: "moop"}, {trackName: "shmoop"}]
  });
});


module.exports = router;
