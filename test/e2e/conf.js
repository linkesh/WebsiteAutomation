/***********************************************************************
 *                                        						       *
 * Author: Siddharth Shanker               						       *
 * Date: December, 2018.                            			   	   *
 * GitHub: https://github.com/Shankerthebunker62/WebsiteAutomation.git *
 *                                        						       *
 ***********************************************************************/

const Path = require('path');

let Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
let HtmlReporter = require('protractor-beautiful-reporter');
let VideoReporter = require('protractor-video-reporter');
let SpecReporter = require('jasmine-spec-reporter').SpecReporter;

let helper = require('./firefox.profile.helper.js');

exports.config = {
		
		getPageTimeout: 30,
		
		allScriptsTimeout: 60000,
		
		// Only for Google-Chrome &, Morzilla-FireFox
		directConnect: true,
		
		/**
		 * Firefox Browser Setting
		 
	      'browserName': 'firefox',
	      'logName': 'Firefox - English',
	      'moz:firefoxOptions': {
	          'args': ['--verbose', '--safe-mode'] // '--headless'
	       }
	       
	       or,
	       
	       getMultiCapabilities: helper.getFirefoxProfile
		*/
		
		capabilities: {
			'shardTestFiles': true,
			'maxInstances': 1,
			    
			'browserName': 'chrome',
			'logName': 'Chrome - English',
			'chromeOptions': {
				'args': ['--disable-gpu', 'test-type', 'disable-popup-blocking', 'start-maximized', 'disable-infobars'], // '--headless'
				'prefs': {
	                'download': {
	                    'prompt_for_download': false,
	                    'directory_upgrade': true,
	                    'default_directory': '/Users/shankerthebunker/git/WebsiteAutomation' + '/test/e2e/resources/downloads/'
	                }
	            }
			}
		},
		
		params: {
			// Project location path
			dirPath : '/Users/shankerthebunker/git/WebsiteAutomation'
		},
		
		onPrepare: function () {
			VideoReporter.prototype.jasmineStarted = function() {
				var self = this;
				if (self.options.singleVideo) {
					var videoPath = Path.join(Path.normalize('./reports_videos/'), 'protractor-specs-' + (new Date()) +'.mov');

					self._startScreencast(videoPath);

					if (self.options.createSubtitles) {
						self._subtitles = [];
						self._jasmineStartTime = new Date();
					}
				}
			};
				    
			jasmine.getEnv().addReporter(new VideoReporter({
			    baseDirectory: Path.normalize('./reports_videos/'),
			    
			    singleVideo: true,
			    createSubtitles: true,
			    saveSuccessVideos: true,
			    
			    //ffmpegCmd: Path.normalize('.\\node_modules\\ffmpeg\\bin\\ffmpeg.exe'),    // --> Windows OS
	            //ffmpegCmd: Path.normalize('/usr/local/bin/ffmpeg'), 						// --> Unix/Linux OS
	            ffmpegArgs: [
	            	  '-y',
	            	  '-r', '30',
	            	  '-f', 'avfoundation',
	            	  '-i', '1',
	            	  '-g', '300',
	            	  '-vcodec', 'mpeg4'
	              ]
	        }));
			
			jasmine.getEnv().addReporter(new HtmlReporter({
		         baseDirectory: './reports_BeautifulReporter/HtmlReport_' + Date(),
		         
		         docTitle: 'Protractor Automation Report',
		         docName: 'Automation_Report.html',
					
		         gatherBrowserLogs: true,
		         preserveDirectory: false
		    }).getJasmine2Reporter());
			
			jasmine.getEnv().addReporter(new SpecReporter({
			      displayStacktrace: 'all', // display stack-trace for each failed assertion, values: (all|specs|summary|none)
			      displaySuccessesSummary: true,
			      displayFailuresSummary: true,
			      displayPendingSummary: true,
			      displaySuccessfulSpec: true,
			      displayFailedSpec: true,
			      displayPendingSpec: true,
			      displaySpecDuration: true, 
			      displaySuiteNumber: true, 
			      
			      colors: {
			        success: 'green',
			        failure: 'red',
			        pending: 'yellow'
			      },
			      
			      prefixes: {
			        success: '✓ ',
			        failure: '✗ ',
			        pending: '* '
			      },
			      
			      customProcessors: []
			}));
			
			jasmine.getEnv().addReporter(new Jasmine2HtmlReporter({
				   savePath: './reports_HtmlReporter/',
				   screenshotsFolder: 'images',
				   takeScreenshots: true,
				   takeScreenshotsOnlyOnFailures: true,
				   fixedScreenshotName: true,
				   consolidate: true,
				   consolidateAll: true,
				   cleanDestination: true,
				   fileNameDateSuffix: true
			}));
			
			browser.driver.manage().window().maximize();
			
			browser.waitForAngularEnabled(true); //true for angular, false otherwise.
		},
		
		specs: ['test\e2e\specs\*.js'],
		
		restartBrowserBetweenTests: false,
		
		SELENIUM_PROMISE_MANAGER: true,
		
		ignoreUncaughtExceptions: true,
		
		logLevel: 'ERROR'|'WARN'|'INFO'|'DEBUG',
		
		resultJsonOutputFile: 'console.json',
		
		//highlightDelay: 1000,
		
		framework: 'jasmine2',
		
		jasmineNodeOpts: {
			showColors: true,
			
			isVerbose: true,
			
			includeStackTrace: true,
			
			defaultTimeoutInterval: 60000,
			
			realtimeFailure: true,
			
			print: function () {
				console.log();
			}
		}
}