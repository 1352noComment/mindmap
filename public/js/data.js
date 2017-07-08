var numPost = 0;

var mindMapData = {

	elements: [
            // nodes
            { data: { id: 'Question' } },
            { data: {id: 'Answer' } },
            { data: {id: 'Right Click to Edit Node Content'} },
            { data: {id: 'Right Click to Add New Node'} },
            { data: {id: 'Get Started'} },

            {
            	data: {
            		id: 'QuestionAnswer',
            		source: 'Question',
            		target: 'Answer'
            	}
            }, {

            	data: {
            		id: 'QuestionAddtexthere',
            		source: 'Question',
            		target: 'Right Click to Edit Node Content'
            	}
            }, {

            	data: {
            		id: 'QuestionAddtexthere2',
            		source: 'Question',
            		target: 'Right Click to Add New Node'
            	}
            }, {

            	data: {
            		id: 'QuestionGetStarted',
            		source: 'Question',
            		target: 'Get Started'
            	}
            }]
        };