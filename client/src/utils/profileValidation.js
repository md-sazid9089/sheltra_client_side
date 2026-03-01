/**
 * Validation utilities for refugee profile form
 */

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateURL = (url) => {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
};

export const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[\d\s+\-()]{10,}$/;
    return phoneRegex.test(phone);
};

export const validateProfileData = (data) => {
    const errors = {};

    // Basic Info Validation
    if (!data.firstName?.trim()) {
        errors.firstName = 'First name is required';
    }
    if (!data.lastName?.trim()) {
        errors.lastName = 'Last name is required';
    }
    if (!data.email?.trim()) {
        errors.email = 'Email is required';
    } else if (!validateEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
    }
    if (!data.dateOfBirth) {
        errors.dateOfBirth = 'Date of birth is required';
    }
    if (!data.gender) {
        errors.gender = 'Gender is required';
    }
    if (data.phoneNumber && !validatePhoneNumber(data.phoneNumber)) {
        errors.phoneNumber = 'Please enter a valid phone number (at least 10 digits)';
    }

    // Location Validation
    if (!data.currentLocation?.trim()) {
        errors.currentLocation = 'Current location is required';
    }
    if (!data.nationality?.trim()) {
        errors.nationality = 'Nationality is required';
    }
    if (!data.countryOfOrigin?.trim()) {
        errors.countryOfOrigin = 'Country of origin is required';
    }

    // Languages Validation
    if (!data.languages || data.languages.length === 0) {
        errors.languages = 'At least one language is required';
    }

    // Skills Validation (optional - skills are not required but if added, must be valid)
    if (data.skills && data.skills.length > 0) {
        const invalidSkills = data.skills.filter(skill => 
            !skill.skillName?.trim() || 
            !skill.proficiency || 
            skill.yearsOfExperience === undefined || 
            skill.yearsOfExperience < 0
        );
        
        if (invalidSkills.length > 0) {
            errors.skills = 'All skills must have a name, proficiency level, and valid years of experience';
        }
    }

    return errors;
};

/**
 * Validate company profile data for employers
 */
export const validateCompanyProfile = (data) => {
    const errors = {};

    // Company Name Validation
    if (!data.companyName?.trim()) {
        errors.companyName = 'Company name is required';
    } else if (data.companyName.trim().length < 2) {
        errors.companyName = 'Company name must be at least 2 characters';
    }

    // Company Website Validation
    if (!data.companyWebsite?.trim()) {
        errors.companyWebsite = 'Company website is required';
    } else if (!validateURL(data.companyWebsite)) {
        errors.companyWebsite = 'Please enter a valid website URL (e.g., https://www.example.com)';
    }

    // Industry Validation
    if (!data.industry?.trim()) {
        errors.industry = 'Industry is required';
    }

    // Company Size Validation
    if (!data.companySize?.trim()) {
        errors.companySize = 'Company size is required';
    }

    // Location Validation
    if (!data.location?.trim()) {
        errors.location = 'Location is required';
    }

    // Description Validation
    if (!data.description?.trim()) {
        errors.description = 'Company description is required';
    } else if (data.description.trim().length < 50) {
        errors.description = 'Company description must be at least 50 characters';
    } else if (data.description.trim().length > 1000) {
        errors.description = 'Company description must not exceed 1000 characters';
    }

    return errors;
};
