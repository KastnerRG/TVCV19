import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PhysicianModel, HierarchyLevel } from 'projects/shared/src/public-api';
import { ToolbarService } from 'src/app/toolbar.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';

export interface CarerNode {
  name: string;
  heirarchy?: HierarchyLevel;
  children?: CarerNode[];
}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
@Component({
  selector: 'app-physician-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./physician-hierarchy.component.scss'],
})
export class HierarchyComponent implements OnInit {
  supervisor: PhysicianModel;
  private _transformer = (node: CarerNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };
  ngOnInit() {
    this.route.data.subscribe(async (data: { model: CarerNode }) => {
      this.dataSource.data = [data.model];
    });
  }
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private route: ActivatedRoute,
    private toolbarService: ToolbarService
  ) {
    this.toolbarService.setToolbarData({ title: 'Hierarchy', menu: [] });
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
