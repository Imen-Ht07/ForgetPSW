import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getUsers().subscribe(
      (data: User[]) => this.users = data,
      error => console.error('Error fetching users', error)
    );
  }

  editUser(userId: string) {
    this.router.navigate(['/update-user', userId]);
  }

  deleteUser(userId: string) {
    this.authService.deleteUser(userId).subscribe(
      response => {
        console.log('User deleted', response);
        this.loadUsers(); // Recharge la liste après suppression
      },
      error => console.error('Delete error', error)
    );
  }
}
