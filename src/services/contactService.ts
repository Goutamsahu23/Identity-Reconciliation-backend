// src/services/contactService.ts
import { AppDataSource } from '../database/dataSource';
import { Contact } from '../entity/Contact';

export const handleIdentifyRequest = async (email?: string, phoneNumber?: string) => {
    const contactRepository = AppDataSource.getRepository(Contact);

    // Find contacts with the given email or phone number
    const contacts = await contactRepository.find({
        where: [
            { email: email },
            { phoneNumber: phoneNumber }
        ]
    });

    if (contacts.length === 0) {
        // Case 1: No existing contacts found, create a new primary contact
        const newContact = contactRepository.create({
            email,
            phoneNumber,
            linkPrecedence: 'primary',
            emails: email ? [email] : [],
            phoneNumbers: phoneNumber ? [phoneNumber] : [],
        });

        await contactRepository.save(newContact);

        return {
            contact: {
                primaryContactId: newContact.id,
                emails: newContact.emails.filter(Boolean),
                phoneNumbers: newContact.phoneNumbers.filter(Boolean),
                secondaryContactIds: []
            }
        };
    }

    // Case 2: Existing contacts found, update primary contact and create secondary contacts if necessary
    let primaryContact = contacts.find(contact => contact.linkPrecedence === 'primary');
    const secondaryContacts = contacts.filter(contact => contact.linkPrecedence === 'secondary');

    // Update primary contact with new email or phone number if provided
    if (email && !primaryContact?.emails.includes(email)) {
        primaryContact.emails.push(email);
        await contactRepository.save(primaryContact);
    }

    if (phoneNumber && !primaryContact?.phoneNumbers.includes(phoneNumber)) {
        primaryContact.phoneNumbers.push(phoneNumber);
        await contactRepository.save(primaryContact);
    }

    // Create new secondary contact if necessary
    if (email && !contacts.some(contact => contact.email === email && contact.linkPrecedence === 'secondary')) {
        const newSecondaryContact = contactRepository.create({
            email,
            phoneNumber,
            linkPrecedence: 'secondary',
            linkedId: primaryContact?.id,
            emails: [email],
            phoneNumbers: phoneNumber ? [phoneNumber] : [],
        });

        await contactRepository.save(newSecondaryContact);
    }

    // Fetch updated contacts after potential save operations
    const updatedContacts = await contactRepository.find({
        where: [
            { email: email },
            { phoneNumber: phoneNumber }
        ]
    });

    primaryContact = updatedContacts.find(contact => contact.linkPrecedence === 'primary');
    const updatedSecondaryContacts = updatedContacts.filter(contact => contact.linkPrecedence === 'secondary');

    const allEmails = [...new Set(updatedContacts.flatMap(contact => contact.emails).filter(Boolean))];
    const allPhoneNumbers = [...new Set(updatedContacts.flatMap(contact => contact.phoneNumbers).filter(Boolean))];
    const secondaryContactIds = updatedSecondaryContacts.map(contact => contact.id);

    return {
        contact: {
            primaryContactId: primaryContact?.id,
            emails: allEmails,
            phoneNumbers: allPhoneNumbers,
            secondaryContactIds: secondaryContactIds
        }
    };
};
