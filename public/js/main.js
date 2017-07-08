$(document).ready(function() {

  $('#contact').click(function() {
    $('#contactForm').fadeToggle();
  })

  $(document).mouseup(function (e) {
    var container = $("#contactForm");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
      container.fadeOut();
    }
  });

  $('.description-mindmap').hide();
  $('.description-calendar').hide();

  $('#calendar').on("mouseenter", function(){
    $('.description-calendar').show('slow');
  });

  $('#calendar').on("mouseleave", function(){
    $('.description-calendar').hide('slow');
  });

  $('#mindmap').on("mouseenter", function(){
    $('.description-mindmap').show('slow');
  });

  $('#mindmap').on("mouseleave", function(){
    $('.description-mindmap').hide('slow');
  });

  $('.mySlideshows').cycle();

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
                'text-max-width': '50px',
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

            layout: {
              name: 'cose-bilkent',
              nodeDimensionsIncludeLabels: true
            }
          });

//Context Menu

var numQ = 0.1;
var numA = 0.4;
var numE = 0.4;

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

  // demo your core ext
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
              var inp = result;
              target.json({data: {name: inp} });
            }
          }
        });
      }
    },
    {
      id: 'remove',
      content: 'Remove',
      selector: 'node, edge',
      onClickFunction: function (event) {
        var target = event.target || event.cyTarget;
        removed = target.remove();
        
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
        if (removed) {
          removed.restore();
        }
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
        
        var pos = event.position || event.cyPosition;

        bootbox.prompt({
          title: "Type Your Question Here:",
          inputType: 'textarea',
          callback: function(result) {
            if (result !== null && result !== "") {
              var inp = result;

              numQ += 0.1;
              var newID = 1 + numQ;
              numE += 0.1;
              var newEdge = 10 + numE;

              cy.add([
              {
                group: 'nodes', 
                data: {id: newID, type: 'q', name: inp, user: 'new'},
                style: {
                  'background-color': '#7A8B8B',
                  'background-opacity': '0.8'
                }
              }, {
                group: 'edges',
                data: {
                  id: newEdge,
                  source: target.id(),
                  target: newID
                }}
                ]);

              var layout = cy.elements().layout({
                name: 'cose-bilkent',
                avoidOverlap: true
              });


              layout.run();

            }}
          });
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

              numQ += 0.1;
              var newID = 1 + numQ;

              cy.add([
              {
                group: 'nodes', 
                data: {id: newID, type: 'q', name: inp, user: 'new'},
                position: {
                  x: pos.x,
                  y: pos.y
                },
                style: {
                  'background-color': '#7A8B8B',
                  'background-opacity': '0.8'
                }
              }]);
            }}
          });
      }
    },
    {
      id: 'add-new-answer',
      content: 'Add New Answer',
      selector: '*',
      //coreAsWell: false,
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

              numA += 0.1;
              var newID = 2 + numA;
              numE += 0.1;
              var newEdge = 10 + numE;

              cy.add([
              {
                group: 'nodes', 
                data: {id: newID, type: 'a', name: inp, user: 'new'},
                style: {
                  'background-color': '#D09683',
                  'background-opacity': '0.8',
                  'shape': 'roundrectangle',
                  'border-color': '#73605B'
                }
              }, {
                group: 'edges',
                data: {
                  id: newEdge,
                  source: target.id(),
                  target: newID
                }, style: {
                  'line-color': '#73605B'
                }}
                ]);

              var layout = cy.elements().layout({
                name: 'cose-bilkent',
                avoidOverlap: true
              });

              layout.run();

            }}
          });
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

              numA += 0.1;
              var newID = 2 + numA;

              cy.add([
              {
                group: 'nodes', 
                data: {id: newID, type: 'a', name: inp, user: 'new'},
                position: {
                  x: pos.x,
                  y: pos.y
                },
                style: {
                  'background-color': '#D09683',
                  'background-opacity': '0.8',
                  'shape': 'roundrectangle',
                  'border-color': '#73605B'
                }
              }]);
            }}
          });
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

              numA += 0.1;
              var newID = 2 + numA;
              numE += 0.1;
              var newEdge = 10 + numE;

              cy.add([
              {
                group: 'nodes', 
                data: {id: newID, type: 'a', name: inp, user: 'new'},
                style: {
                  'background-color': '#4E313E',
                  'background-opacity': '0.6',
                  'shape': 'roundrectangle',
                  'border-color': '#73605B'
                }
              }, {
                group: 'edges',
                data: {
                  id: newEdge,
                  source: target.id(),
                  target: newID
                }, style: {
                  'line-color': '#73605B'
                }}
                ]);

              var layout = cy.elements().layout({
                name: 'cose-bilkent',
                avoidOverlap: true
              });

              layout.run();

            }}
          });
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

              numA += 0.1;
              var newID = 2 + numA;

              cy.add([
              {
                group: 'nodes', 
                data: {id: newID, type: 'a', name: inp, user: 'new'},
                position: {
                  x: pos.x,
                  y: pos.y
                },
                style: {
                  'background-color': '#4E313E',
                  'background-opacity': '0.6',
                  'shape': 'roundrectangle',
                  'border-color': '#73605B'
                }
              }]);
            }}
          });
      }
    },
    {
      id: 'remove-selected',
      content: 'Remove Selected',
      coreAsWell: true,
      show: false,
      onClickFunction: function (event) {
        removedSelected = cy.$(':selected').remove();

        contextMenu.hideMenuItem('remove-selected');
        contextMenu.showMenuItem('restore-selected');
      }
    },
    {
      id: 'restore-selected',
      content: 'Restore Selected',
      coreAsWell: true,
      show: false,
      onClickFunction: function (event) {
        if (removedSelected) {
          removedSelected.restore();
        }
        //contextMenu.showMenuItem('remove-selected');
        contextMenu.hideMenuItem('restore-selected');
      }
    },                      
    {
      id: 'select-all-nodes',
      content: 'Select All Nodes',
      selector: 'node',
      show: true,
      onClickFunction: function (event) {
        selectAllOfTheSameType(event.target || event.cyTarget);
        
        contextMenu.hideMenuItem('select-all-nodes');
        contextMenu.showMenuItem('remove-selected');
        contextMenu.showMenuItem('unselect-all-nodes');
      }
    },
    {
      id: 'unselect-all-nodes',
      content: 'Unselect All Nodes',
      selector: 'node',
      show: false,
      onClickFunction: function (event) {
        unselectAllOfTheSameType(event.target || event.cyTarget);
        
        contextMenu.showMenuItem('select-all-nodes');
        contextMenu.hideMenuItem('remove-selected');
        contextMenu.hideMenuItem('unselect-all-nodes');
      }
    }]
  });


//Qtip

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

//Edge Handles to connect Nodes

cy.edgehandles('drawon');

cy.edgehandles({
 toggleOffOnLeave: true,
 handleNodes: "node",
 handleSize: 10,
 edgeType: function(){ return 'flat'; }
});
});