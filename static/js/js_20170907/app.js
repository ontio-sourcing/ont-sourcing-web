var app = angular.module('hashtool', []);

app.controller("hashCalcCtrl", function($scope) {
	$scope.hashRawData = "";
	$scope.hashedData = "";

	$scope.hashAlgo  = "sha256";
	$scope.hashAlgos = [
		{name:'sha256',algo:'sha256'},
		{name:'sm3',algo:'sm3'},
		{name:'md5',algo:'md5'},
    ];

	$scope.hashCalc = function() {
		if ( $scope.hashAlgo == 'sha256' ) {
			$scope.hashedData = CryptoJS.SHA256($scope.hashRawData);
		} else if ( $scope.hashAlgo == 'sm3' ) {
			var x = sm3();
			var ab = [];
			for (i=0; i<$scope.hashRawData.length; i++) {
				ab[i] = $scope.hashRawData[i].charCodeAt();
			}
			
			$scope.hashedData = ab2hexstring( x.sum(ab) );
		} else if ( $scope.hashAlgo == 'md5' ) {
			$scope.hashedData = CryptoJS.MD5($scope.hashRawData);
		}
	}
});