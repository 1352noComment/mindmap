$(document).ready(function() {

  //Websocket Connection

  var socket = io.connect('http://localhost:3000');

  var removed;
  var numExecuted = 1;

  socket.on('edit', editNode);
  socket.on('addQuestion', addQuestionEdge);
  socket.on('addQuestionCore', addQuestionOnCore);
  socket.on('addAnswer', addAnswerEdge);
  socket.on('addAnswerOnCore', newAnswerOnCore);
  socket.on('CustomNode', AddCustomNode);
  socket.on('CustomNodeOnCore', AddCustomNodeOnCore);
  socket.on('removeNode', remove);
  socket.on('undoRemove', undoRemoveNode);
  //socket.on('addEdge', addNewEdge);

  /*function addNewEdge(info) {

    if (numExecuted % 2 != 0) {
      numExecuted++;
      console.log(numExecuted);

      var target = cy.getElementById(info.targetID);
      console.log(info.targetID);
      if (target.data('type') === 'q') {
        cy.add([
        {
          group: 'edges',
          data: {
            id: info.EID,
            source: info.sourceID,
            target: info.targetID
          }
        }]);
      }

      if (target.data('type') === 'a') {
        cy.add([
        {
          group: 'edges',
          data: {
            id: info.EID,
            source: info.sourceID,
            target: info.targetID
          }, style: {
            'line-color': '#73605B'
          }}]);
      }

      if (target.data('type') === 'c') {
        cy.add([
        {
          group: 'edges',
          data: {
            id: info.EID,
            source: info.sourceID,
            target: info.targetID
          }, style: {
            'line-color': '#4E313E'
          }}]);
      }
    }
  }*/

  function undoRemoveNode(info) {
    if (removed) {
      removed.restore();
    }
  }

  function remove(info) {
    var target = cy.getElementById(info.targetID);
    removed = target.remove();
  }

  function AddCustomNodeOnCore(info) {
    cy.add([
    {
      group: 'nodes', 
      data: {id: info.CID, type: 'a', name: info.input, user: 'new'},
      position: {
        x: info.position.x,
        y: info.position.y
      },
      style: {
        'background-color': '#4E313E',
        'background-opacity': '0.6',
        'shape': 'rectangle',
        'border-color': '#4E313E'
      }
    }]);

    updateBounds();
  }


  function AddCustomNode(info) {

    cy.add([
    {
      group: 'nodes', 
      data: {id: info.CID, type: 'c', name: info.input, user: 'new'},
      style: {
        'background-color': '#4E313E',
        'background-opacity': '0.6',
        'shape': 'rectangle',
        'border-color': '#4E313E'
      }
    }, {
      group: 'edges',
      data: {
        id: info.EID,
        source: info.targetID,
        target: info.CID
      }, style: {
        'line-color': '#4E313E'
      }}
      ]);

    var layout = cy.elements().layout({
      name: 'cose-bilkent',
      avoidOverlap: true
    });

    layout.run();

    updateBounds();

  }

  function newAnswerOnCore(info) {
    cy.add([
    {
      group: 'nodes', 
      data: {id: info.AID, type: 'c', name: info.input, user: 'new'},
      position: {
        x: info.position.x,
        y: info.position.y
      },
      style: {
        'background-color': '#D09683',
        'background-opacity': '0.8',
        'shape': 'roundrectangle',
        'border-color': '#73605B'
      }
    }]);

    updateBounds();
  }

  function addAnswerEdge(info) {
    cy.add([
    {
      group: 'nodes', 
      data: {id: info.AID, type: 'a', name: info.input, user: 'new'},
      style: {
        'background-color': '#D09683',
        'background-opacity': '0.8',
        'shape': 'roundrectangle',
        'border-color': '#73605B'
      }
    }, {
      group: 'edges',
      data: {
        id: info.EID,
        source: info.targetID,
        target: info.AID
      }, style: {
        'line-color': '#73605B'
      }}
      ]);

    var layout = cy.elements().layout({
      name: 'cose-bilkent',
      avoidOverlap: true
    });

    layout.run();

    updateBounds();
  }

  function addQuestionOnCore(info) {

    cy.add([
    {
      group: 'nodes', 
      data: {id: info.QID, type: 'q', name: info.input, user: 'new'},
      position: {
        x: info.position.x,
        y: info.position.y
      },
      style: {
        'background-color': '#7A8B8B',
        'background-opacity': '0.8'
      }
    }]);

    updateBounds();
  }

  function addQuestionEdge(info) {

    cy.add([
    {
      group: 'nodes', 
      data: {id: info.QID, type: 'q', name: info.input, user: 'new'},
      style: {
        'background-color': '#7A8B8B',
        'background-opacity': '0.8'
      }
    }, {
      group: 'edges',
      data: {
        id: info.EID,
        source: info.targetID,
        target: info.QID
      }}
      ]);

    var layout = cy.elements().layout({
      name: 'cose-bilkent',
      avoidOverlap: true
    });

    layout.run();

    updateBounds();
  }

  function editNode(info) {
    console.log('Broadcasted ' + info.input + ' at target ' + info.targetID);
    var targetNode = cy.getElementById(info.targetID);
    targetNode.json({data: {name: info.input} });
  }

  //Cytoscape Default Mind Map Interface

  var cy = cytoscape({
    container: document.getElementById('cy'),

//Default Layout

elements: [
            // nodes
            { data: {id: '1.1', type: 'q', name: 'Question', user: 'default'} },
            { data: {id: '2.1', type: 'a', name: 'Answer', user: 'default'} },
            { data: {id: '2.2', type: 'a', name: 'Right Click to Edit Node Content', user: 'default'} },
            { data: {id: '2.3', type: 'a', name: 'Right Click to Add New Node', user: 'default'} },
            { data: {id: '2.4', type: 'a', name: 'Get Started', user: 'default'} },

            // edges
            {
              data: {
                id: 'q1a1',
                source: '1.1',
                target: '2.1'
              }
            }, {

              data: {
                id: 'q1a2',
                source: '1.1',
                target: '2.2'
              }
            }, {

              data: {
                id: 'q1a3',
                source: '1.1',
                target: '2.3'
              }
            }, {

              data: {
                id: 'q1a4',
                source: '1.1',
                target: '2.4'
              }
            }],

            style: [
            {
              selector: 'node',
              style: {
                width: 'label',
                height: 'label',
                shape: 'ellipse',
                'background-color': '#7A8B8B',
                'color': '#363237',
                'avoidOverlap': 'true',
                'background-opacity': '0.7',
                'border-width': '1',
                'border-opacity': '1',
                'border-color': '#363237',
                label: 'data(name)',
                'text-wrap': 'wrap',
                'text-max-width': 50,
                'text-valign': 'center',
                'text-halign': 'center',
                'padding': '15px'
              }
            },
            {
              selector: 'edge',
              style: {
                width: '2.3',
                'line-color': '#2D4262',
                'curve-style': 'bezier'

              }
            }, {
              selector: '.edgehandles-hover',
              css: {
                'background-color': 'red'
              }
            },
            {
              selector: '.edgehandles-source',
              css: {
                'border-width': '2',
                'border-color': 'red'
              }
            },
            {
              selector: '.edgehandles-target',
              css: {
                'border-width': '2',
                'border-color': 'red'
              }
            },
            {
              selector: '.edgehandles-preview, .edgehandles-ghost-edge',
              css: {
                'line-color': 'red',
                'target-arrow-color': 'red',
                'source-arrow-color': 'red'
              }
            }],
            zoomingEnabled: false,
            layout: {
              name: 'cose-bilkent',
              nodeDimensionsIncludeLabels: true,
              avoidOverlap: true
            }
          });

  var nav;
  var navOn;

  $('#mindmapNavigator').click(function() {
    if (navOn === true) {
      nav.destroy();
      navOn = false;
      return;
    }
    if (navOn === undefined || navOn === false) {
      nav = cy.navigator();
      navOn = true;
    }
  });

 /* var img = cy.png();

  $('#link').click(function(e) {
    console.log('clicked');
    $('#link').attr('src', img);
  });*/

  //Center Mindmap

  cy.on('ready', function () {
    cy.center();
  });
//if they resize the window, resize the diagram
$(window).resize(function () {
  updateBounds();
});

var updateBounds = function () {
  var sidebarHeight = 400;
  sidebarHeight += 400;
  var bounds = cy.elements().boundingBox();
  $('#cy').css('height', bounds.h + 400);
  $('#cy').css('width', bounds.w + 900);
  cy.resize();
  cy.center();
};


//Context Menu

//Numbering nodes based on type for ID

var numQ = 0.00000000001;
var numA = 0.00000000004;
var numE = 0.00000000004;
var numC = 0;

var selectAllOfTheSameType = function(ele) {
  cy.elements().unselect();
  if(ele.isNode()) {
    cy.nodes().select();
  }
  else if(ele.isEdge()) {
    cy.edges().select();
  }
};

var unselectAllOfTheSameType = function(ele) {
  if(ele.isNode()) {
    cy.nodes().unselect();
  }
  else if(ele.isEdge()) {
    cy.edges().unselect();
  }
};  

var removed;
var removedSelected;

  // Context Menu Functions
  var contextMenu = cy.contextMenus({
    menuItems: [
    {
      id: 'edit',
      content: 'Edit Content',
      selector: 'node',
      onClickFunction: function(event) {
        var target = event.target || event.cyTarget;

        bootbox.prompt({
          title: "Type Your Content Here:",
          inputType: 'textarea',
          callback: function(result) {
            if (result !== null && result !== "") {

              console.log(this.id);

              var info = {
                input: result,
                targetID: target.id()
              }

              socket.emit('edit', info);

            }}});
      }
    },
    {
      id: 'remove',
      content: 'Remove',
      selector: 'node, edge',
      onClickFunction: function (event) {
        var target = event.target || event.cyTarget;
        info = {
          targetID: target.id()
        }

        socket.emit('removeNode', info);
        
        contextMenu.showMenuItem('undo-last-remove');
      },
      hasTrailingDivider: true
    },
    {
      id: 'undo-last-remove',
      content: 'Undo Last Remove',
      selector: 'node, edge',
      show: false,
      coreAsWell: true,
      onClickFunction: function (event) {

        socket.emit('undoRemove');

        contextMenu.hideMenuItem('undo-last-remove');
      },
      hasTrailingDivider: true
    },                      
    {
      id: 'add-new-question',
      content: 'Add New Question',
      selector: '*',
      onClickFunction: function (event) {
        var target = event.target || event.cyTarget;

        bootbox.prompt({
          title: "Type Your Question Here:",
          inputType: 'textarea',
          callback: function(result) {
            if (result !== null && result !== "") {
              var inp = result;

              numQ += 0.00000000001;
              var newID = 1 + numQ;
              numE += 0.00000000001;
              var newEdge = 10 + numE;

              var info = {
                input: result,
                targetID: target.id(),
                QID: newID,
                EID: newEdge
              }

              socket.emit('addQuestion', info);

            }}});
      }
    },
    {
      id: 'add-new-question',
      content: 'Add New Question',
      coreAsWell: true,
      onClickFunction: function (event) {

        var pos = event.position || event.cyPosition;

        

        bootbox.prompt({
          title: "Type Your Question Here:",
          inputType: 'textarea',
          callback: function(result) {
            if (result !== null && result !== "") {
              var inp = result;

              numQ += 0.00000000001;
              var newID = 1 + numQ;

              var info = {
                input: result,
                QID: newID,
                position: pos
              }

              socket.emit('addQuestionCore', info);

            }}});
      }
    },
    {
      id: 'add-new-answer',
      content: 'Add New Answer',
      selector: '*',
      onClickFunction: function (event) {

        var target = event.target || event.cyTarget;

        var inp;

        var pos = event.position || event.cyPosition;

        bootbox.prompt({
          title: "Type Your Answer Here:",
          inputType: 'textarea',
          callback: function(result) {
            if (result !== null && result !== "") {
              var inp = result;

              numA += 0.00000000001;
              var newID = 2 + numA;
              numE += 0.00000000001;
              var newEdge = 10 + numE;

              var info = {
                input: result,
                AID: newID,
                EID: newEdge,
                targetID: target.id()
              }

              socket.emit('addAnswer', info);

            }}});
      }
    },
    {
      id: 'add-new-answer',
      content: 'Add New Answer',
      coreAsWell: true,
      onClickFunction: function (event) {


        var pos = event.position || event.cyPosition;

        var inp;

        bootbox.prompt({
          title: "Type Your Answer Here:",
          inputType: 'textarea',
          callback: function(result) {
            if (result !== null && result !== "") {
              var inp = result;

              numA += 0.00000000001;
              var newID = 2 + numA;

              var info = {
                input: result,
                AID: newID,
                position: pos
              }

              socket.emit('addAnswerOnCore', info);

            }}});
      }
    },
    {
      id: 'add-custom-node-on-core',
      content: 'Add Custom Node',
      selector: '*',
      onClickFunction: function(event) {
        var target = event.target || event.cyTarget;

        var inp;

        var pos = event.position || event.cyPosition;

        bootbox.prompt({
          title: "Type Your Content Here:",
          inputType: 'textarea',
          callback: function(result) {
            if (result !== null && result !== "") {
              var inp = result;

              numC += 0.00000000001;
              var newID = 3 + numC;
              numE += 0.00000000001;
              var newEdge = 10 + numE;

              info = {
                input: result,
                targetID: target.id(),
                CID: newID,
                EID: newEdge
              }

              socket.emit('CustomNode', info);

            }}});
      }
    },
    {
      id: 'add-custom-node',
      content: 'Add Custom Node',
      coreAsWell: true,
      onClickFunction: function(event) {

        var target = event.target || event.cyTarget;

        var pos = event.position || event.cyPosition;

        var inp;  

        bootbox.prompt({
          title: "Type Your Content Here:",
          inputType: 'textarea',
          callback: function(result) {
            if (result !== null && result !== "") {
              var inp = result;

              numC += 0.00000000001;
              var newID = 3 + numC;

              info = {
                input: result,
                position: pos,
                CID: newID
              }

              socket.emit('CustomNodeOnCore', info);
            }}});
      }}]
    });


//Q-Tip

cy.elements().qtip({
  content: function(){ return 'Last edited by ' + this.data('user') },
  position: {
    my: 'top center',
    at: 'bottom center'
  },
  style: {
    classes: 'qtip-bootstrap',
    tip: {
      width: 16,
      height: 8
    }
  }
});

//Edge Handles to Connect Nodes

cy.edgehandles('drawon');

cy.edgehandles({
 toggleOffOnLeave: true,
 handleNodes: "node",
 handleSize: 10,
 edgeType: function(){
  return 'flat';
},
complete: function(sourceNode, targetNode, addedEntities) {
  numE += 0.00000000001;
  var newEdge = 10 + numE;
  var numSent = 0;
  numSent++;

  info = {
    sourceID: sourceNode.id(),
    targetID: targetNode.id(),
    EID: newEdge,
    num: numSent
  } 

  socket.emit('addEdge', info);

}});
});