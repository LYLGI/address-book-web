<template>
  <div>
    <el-button type="primary" @click="showAddContactDialog">Add Contact</el-button>
    <el-table :data="contacts" style="width: 100%">
      <el-table-column prop="name" label="Name"></el-table-column>
      <el-table-column prop="phone" label="Phone"></el-table-column>
      <el-table-column prop="address" label="Address"></el-table-column>
      <el-table-column prop="email" label="Email"></el-table-column>
      <el-table-column label="Actions">
        <template slot-scope="scope">
          <el-button @click="showEditContactDialog(scope.row)" type="text">Edit</el-button>
          <el-button @click="confirmDeleteContact(scope.row)" type="text" style="color: red">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Add/Edit Contact Dialog -->
    <el-dialog :visible.sync="isDialogVisible" title="Contact Form">
      <el-form :model="currentContact" :rules="rules" ref="contactForm" label-width="100px">
        <el-form-item label="Name" prop="name">
          <el-input v-model="currentContact.name"></el-input>
        </el-form-item>
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="currentContact.phone"></el-input>
        </el-form-item>
        <el-form-item label="Address">
          <el-input v-model="currentContact.address"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="currentContact.email"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitForm('contactForm')">Save</el-button>
      </div>
    </el-dialog>

    <!-- Confirm Delete Dialog -->
    <el-dialog :visible.sync="isDeleteDialogVisible" title="Confirm Delete">
      <span>Are you sure you want to delete this contact?</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDeleteDialogVisible = false">Cancel</el-button>
        <el-button type="danger" @click="deleteContact">Delete</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      contacts: [],
      isDialogVisible: false,
      isDeleteDialogVisible: false,
      currentContact: {
        id: null,
        name: '',
        phone: '',
        address: '',
        email: '',
      },
      contactToDelete: null,
      rules: {
        name: [
          { required: true, message: 'Name is required', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: 'Phone is required', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: 'Invalid phone number format', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: 'Invalid email format', trigger: ['blur', 'change'] }
        ]
      },
    };
  },
  methods: {
    fetchContacts() {
      axios.get('/api/contacts')
        .then(response => {
          this.contacts = response.data;
        })
        .catch(error => {
          console.error("Error fetching contacts:", error);
        });
    },
    showAddContactDialog() {
      this.currentContact = { id: null, name: '', phone: '', address: '', email: '' };
      this.isDialogVisible = true;
    },
    showEditContactDialog(contact) {
      axios.get(`/api/contacts/${contact.id}`)
        .then(response => {
          this.currentContact = response.data;
          this.isDialogVisible = true;
        })
        .catch(error => {
          console.error("Error fetching contact:", error);
        });
    },
    confirmDeleteContact(contact) {
      this.contactToDelete = contact;
      this.isDeleteDialogVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveContact();
        } else {
          console.log('Validation failed');
          return false;
        }
      });
    },
    saveContact() {
      if (this.currentContact.id) {
        axios.put(`/api/contacts/${this.currentContact.id}`, this.currentContact)
          .then(() => {
            this.isDialogVisible = false;
            this.fetchContacts();
          })
          .catch(error => {
            console.error("Error updating contact:", error);
          });
      } else {
        axios.post('/api/contacts', this.currentContact)
          .then(() => {
            this.isDialogVisible = false;
            this.fetchContacts();
          })
          .catch(error => {
            console.error("Error adding contact:", error);
          });
      }
    },
    deleteContact() {
      axios.delete(`/api/contacts/${this.contactToDelete.id}`)
        .then(() => {
          this.isDeleteDialogVisible = false;
          this.fetchContacts();
        })
        .catch(error => {
          console.error("Error deleting contact:", error);
        });
    },
  },
  created() {
    this.fetchContacts();
  },
};
</script>
